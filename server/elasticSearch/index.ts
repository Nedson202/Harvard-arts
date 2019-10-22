import elasticSearch from 'elasticsearch';
import dotenv from 'dotenv';
import { stackLogger } from 'info-logger';
import { logger } from '..';

dotenv.config();

interface PaginateData {
  from: number;
  size: number;
}

const host = process.env.NODE_ENV.match('production')
  ? process.env.BONSAI_URL : process.env.ELASTIC_LOCAL;

const elasticClient = new elasticSearch.Client({
  hosts: [host],
  log: 'info',
});

elasticClient.ping({
  requestTimeout: 30000,
}, (error: string) => {
  if (error) {
    stackLogger(error);
  } else {
    logger.info('-- Elastic client is still alive --');
  }
});

export const checkHealthStatus = () => {
  elasticClient.cluster.health({}, (error, resp) => {
    if (error) { stackLogger(error); }
    logger.info('-- Elastic client is up and running --', resp);
  });
};

const createIndex = () => {
  elasticClient.indices.create({
    index: 'arts',
  }, (error: string, resp: string, status: string) => {
    if (error) {
      stackLogger(error);
      logger.info('-- An Error Occurred creating index', error);
    } else {
      logger.info('-- Index successfully created', resp, status);
    }
  });
};

elasticClient.indices.exists({
  index: 'arts',
}, (error: any, resp: any) => {
  if (error) { logger.info('-- An Error Occurred in indexExists', error); }
  if (!resp) {
    createIndex();
  }
});

export const createMapping = () => elasticClient.indices.putMapping({
  index: 'arts',
  type: 'art',
  body: {
    properties: {
      title: { type: 'text' },
      id: { type: 'integer' },
      accessionyear: { type: 'integer' },
      suggest: {
        type: 'completion',
        analyzer: 'simple',
        search_analyzer: 'standard',
      },
    },
  },
});

export const deleteIndex = (index: string) => {
  elasticClient.indices.delete({ index }, (error: string, resp: string, status: string) => {
    if (error) { return stackLogger(error); }
    logger.info('-- Index successfully deleted', resp, status);
  });
};

export const addDocument = (index: any, type: string) => {
  elasticClient.index({
    index: 'arts',
    id: index.id,
    type,
    body: index,
  }, (error: string, resp: string) => {
    if (error) { return stackLogger(error); }
    logger.info('---Object added successfully---', resp);
  });
};

export const elasticBulkCreate = (bulk: object[]) => {
  const data: object[] = [];
  bulk.forEach((object: any) => {
    const { id } = object;
    data.push({
      index: {
        _index: 'arts',
        _type: 'art',
        _id: id,
      },
    });
    data.push(object);
  });

  elasticClient.bulk({ body: data }, (error) => {
    if (error) { return stackLogger(error); }
    logger.info('Successfully imported added all data');
  });
};

export const elasticItemSearch = async (query: string, paginateData: PaginateData) => {
  const { from, size } = paginateData;
  const matchAll = {
    match_all: {},
  };

  const multiMatch = {
    multi_match: {
      query,
      type: 'phrase_prefix',
      fields: ['title', 'century', 'accessionmethod', 'period', 'technique',
        'classification', 'department', 'culture', 'medium',
        'verificationleveldescription'],
    },
  };

  const body = {
    size,
    from,
    query: !query || !query.length ? matchAll : multiMatch,
  };

  const hits = await elasticClient.search({ index: 'arts', body, type: 'art' })
    .then((results) => results.hits.hits.map((result) => result._source)) // eslint-disable-line
    .catch((error) => {
      stackLogger(error);
    });

  return hits;
};
