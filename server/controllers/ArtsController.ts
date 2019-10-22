import https from 'https';
import { Request, Response, NextFunction } from 'express';

import { addDataToRedis, getDataFromRedis } from '../redis';
import { addDocument, elasticBulkCreate, elasticItemSearch } from '../elasticSearch';
import { stackLogger } from 'info-logger';
import {
  placesData, healthCheckMessage, baseUrl, defaultEncoding,
  HARVARD_API_KEY,
} from '../utils';

class ArtsController {
  public static async healthChecker(_: any, res: Response) {
    return res.status(200).json({
      error: false,
      message: healthCheckMessage,
    });
  }

  public static dataRandomizer(data: object[]) {
    return data.map((element) => [Math.random(), element])
      .sort((indexA: any, indexB: any) => indexA[0] - indexB[0])
      .map((indexA) => indexA[1]);
  }

  public static async retrieveDataFromHarvardAPI(url: string) {
    const data = await new Promise<string>((resolve, reject) => {
      const fullUrl = `${baseUrl}${url}`;
      https.get(fullUrl, (resp) => {
        resp.setEncoding(defaultEncoding);
        let body: string = '';
        resp.on('data', (resData) => {
          body += resData;
        });
        resp.on('error', (error) => {
          reject(error);
        });
        resp.on('end', () => {
          resolve(body);
        });
      });
    });

    return JSON.parse(data);
  }

  public static async getObjects(req: Request, res: Response, next: NextFunction) {
    try {

      let objects: any;
      const { size, page } = req.query;
      const redisHash = `objects - size ${size} - page ${page}`;
      objects = await getDataFromRedis(redisHash);

      if (!objects) {
        const url = `object?apikey=${HARVARD_API_KEY}&hasimage=1&size=${size}&page=${page}`;
        objects = await ArtsController.retrieveDataFromHarvardAPI(url);
        addDataToRedis(redisHash, objects);
        elasticBulkCreate(objects.records);
      }
      const randomizedData = ArtsController.dataRandomizer(objects.records);

      if (objects) {
        return res.status(200).json({
          error: false,
          message: 'Harvard art objects retrieved successfully',
          records: randomizedData,
        });
      }
    } catch (error) {
      error.httpStatusCode = 500;
      return next(error);
    }
  }

  public static async getObject(req: Request, res: Response, next: NextFunction) {
    try {
      const { objectId } = req.params;
      let queryResponse: any = '';
      const redisHash = `objectId-${objectId}`;
      queryResponse = await getDataFromRedis(redisHash);

      if (!queryResponse) {
        const url = `object/${objectId}?apikey=${HARVARD_API_KEY}`;
        queryResponse = await ArtsController.retrieveDataFromHarvardAPI(url);
        addDocument(queryResponse, 'art');
        addDataToRedis(redisHash, queryResponse);
      }

      if (queryResponse) {
        return res.status(200).json({
          error: false,
          message: 'Harvard art object retrieved successfully',
          record: queryResponse,
        });
      }
    } catch (error) {
      error.httpStatusCode = 500;
      return next(error);
    }
  }

  public static async searchArts(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, from, size } = req.query;
      let queryResponse;
      const redisHash = `query-${query}-size-${size}-${from}`;
      queryResponse = await getDataFromRedis(redisHash);

      if (!queryResponse) {
        queryResponse = await elasticItemSearch(query, {
          from, size,
        });
      }

      if (queryResponse) {
        return res.status(200).json({
          error: false,
          message: 'Records retrieved successfully',
          results: queryResponse,
        });
      }
    } catch (error) {
      error.httpStatusCode = 500;
      return next(error);
    }
  }

  public static async getPublications(req: Request, res: Response, next: NextFunction) {
    try {
      let publications: any;
      const { size, page, year } = req.query;
      const redisHash = `size ${size}- page ${page} - publications`;
      // publications = 0;
      publications = await getDataFromRedis(redisHash);

      if (!publications) {
        const url = `publication?q=publicationyear:${year}&apikey=${HARVARD_API_KEY}&page=${page}&size=${size}`;
        publications = await ArtsController.retrieveDataFromHarvardAPI(url);
        addDataToRedis(redisHash, publications);
        // elasticBulkCreate(publications.records);
      }
      const randomizedData = ArtsController.dataRandomizer(publications.records);

      if (publications) {
        return res.status(200).json({
          error: false,
          message: 'Harvard art objects retrieved successfully',
          publications: randomizedData,
        });
      }
    } catch (error) {
      error.httpStatusCode = 500;
      return next(error);
    }
  }

  public static async getPlaceIds(req: Request, res: Response, next: NextFunction) {
    try {
      let allPlacesIdsRedis: any;
      const { from, size } = req.query;
      const placeIdsHash = 'all_parent_IDS_for_places';

      allPlacesIdsRedis = await getDataFromRedis(placeIdsHash);

      if (!allPlacesIdsRedis.length) {
        const data: any = await placesData();
        allPlacesIdsRedis = data.allPlacesIds;
      }

      const partitionData = allPlacesIdsRedis.splice(from, size);
      return res.status(200).json({
        error: false,
        message: 'Harvard art place IDs retrieved successfully',
        places: partitionData,
      });
    } catch (error) {
      error.httpStatusCode = 500;
      return next(error);
    }
  }

  public static async getPlaces(req: Request, res: Response, next: NextFunction) {
    try {
      const { placeId } = req.query;
      let allPlacesRedis: any;
      let retrievedPlaces: any;
      const allPlacesHash = 'all_places_2356';

      allPlacesRedis = await getDataFromRedis(allPlacesHash);

      if (!allPlacesRedis.length) {
        const data: any = await placesData();
        allPlacesRedis = data.allPlacesData;
      }

      const randomizedData = ArtsController.dataRandomizer(allPlacesRedis);
      retrievedPlaces = randomizedData.slice(0, 100);

      if (placeId) {
        retrievedPlaces = allPlacesRedis
          .filter((place: any) => place.parentplaceid === Number(placeId));
      }

      return res.status(200).json({
        error: false,
        message: 'Harvard art places retrieved successfully',
        places: retrievedPlaces,
      });
    } catch (error) {
      error.httpStatusCode = 500;
      return next(error);
    }
  }

  public static async getExhibitions(req: Request, res: Response) {
    try {
      let exhibitions: any;
      const { size, page } = req.query;
      const redisHash = `size ${size}- page ${page} -exhibition`;
      // exhibitions = await getDataFromRedis(redisHash);

      if (!exhibitions) {
        const url = `exhibition/397?apikey=${HARVARD_API_KEY}`;
        exhibitions = await ArtsController.retrieveDataFromHarvardAPI(url);
        addDataToRedis(redisHash, exhibitions);
      }
      // const randomizedData = ArtsController.dataRandomizer(exhibitions.records);

      if (exhibitions) {
        return res.status(200).json({
          error: false,
          message: 'Harvard art exhibitons retrieved successfully',
          records: exhibitions,
          // records: randomizedData,
        });
      }
    } catch (error) {
      stackLogger(error);
      return res.status(200).json({
        error,
        message: 'Sorry, an error occurred',
      });
    }
  }
}

export default ArtsController;
