import { addDataToRedis } from './../redis/index';
import fs from 'fs';

interface PlaceIDObject {
  parentPlaceID: string;
  pathForward: string;
}

const allPlacesHash = 'all_places_2356';
const placeIdsHash = 'all_parent_IDS_for_places';

const places: any = [];

const getUnique = (data: any, keyToCheck: string) => {
  return data.filter((obj: any, pos: any, arr: any) => {
    return arr.map((mapObj: any) => mapObj[keyToCheck])
    .indexOf(obj[keyToCheck]) === pos;
  });
};

const placesData = (): Promise<object>  => {
  return new Promise((resolve, reject) => {
    return fs.readFile('places.json', 'utf8', (err: any, readResponse: any) => {
      if (err) {
        reject(err);
      }
      const readData = JSON.parse(readResponse);
      readData.forEach((element: any) => {
        const parsePath = element.pathforward.split('\\').filter((elem: string) => String(elem));
        const pathForward = parsePath[parsePath.length - 1];
        let parent: any = {};
        parent.parentPlaceID = element.parentplaceid;
        parent.pathForward = pathForward;
        if (element.geo && Object.keys(element.geo).length && parent.parentPlaceID) {
          places.push(parent);
          parent = {};
        }
      });
      const removedDuplicates = getUnique(places, 'pathForward');
      const sortData = removedDuplicates.sort((indexA: PlaceIDObject, indexB: PlaceIDObject) => {
        if (indexA.pathForward > indexB.pathForward) {
          return 1;
        } else {
          return -1;
        }
      });
      addDataToRedis(placeIdsHash, sortData);
      addDataToRedis(allPlacesHash, readData);
      resolve({
        allPlacesData: readData,
        allPlacesIds: places,
      });
    });
  });
};

export default placesData;
