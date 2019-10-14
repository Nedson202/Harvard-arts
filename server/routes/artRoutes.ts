
import { Router } from 'express';
import { ArtsController} from '../controllers';

const router = Router();

const {
  healthChecker, getObjects,
  getObject, searchArts, getPublications, getPlaces,
  getPlaceIds, getExhibitions,
} = ArtsController;

router.get(
  '/healthCheck',
  healthChecker,
);

router.get(
  '/object?',
  getObjects,
);

router.get(
  '/object/:objectId',
  getObject,
);

router.get(
  '/search?',
  searchArts,
);

router.get(
  '/publications',
  getPublications,
);

router.get(
  '/places',
  getPlaces,
);

router.get(
  '/places/ids?',
  getPlaceIds,
);

router.get(
  '/exhibitions?',
  getExhibitions,
);

router.get(
  '/exhibitions/exhibitionId?',
  getPlaceIds,
);

export default router;
