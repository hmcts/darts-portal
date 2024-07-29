const express = require('express');
const _ = require('lodash');
const { localArray } = require('../../localArray');
const { SUPER_ADMIN } = require('../../roles');
const { userIdHasAnyRoles } = require('../../users');
const { DateTime } = require('luxon');

const router = express.Router();

const courthousesArray = localArray('courthouses').value;

//Prevents original array being modified
const defaultCourthouses = structuredClone(courthousesArray);

let courthouseList = defaultCourthouses;

const getCourthouseByCourthouseId = (courthouseId) => {
  //Prevents original array being modified
  const courthouses = structuredClone(courthouseList);
  return courthouses.find((courthouse) => courthouse.id === parseInt(courthouseId));
};

router.get('/reset', (req, res) => {
  courthouseList = defaultCourthouses;
  res.sendStatus(200);
});

router.get('/:courthouseId', (req, res) => {
  if (!userIdHasAnyRoles([SUPER_ADMIN], req.headers.user_id))
    return res.status(403).send({
      detail: `You do not have permission`,
    });
  const courthouse = getCourthouseByCourthouseId(req?.params?.courthouseId);
  if (!courthouse) return res.sendStatus(404);
  res.send(courthouse);
});

router.patch('/:courthouseId', (req, res) => {
  if (!userIdHasAnyRoles([SUPER_ADMIN], req.headers.user_id))
    return res.status(403).send({
      detail: `You do not have permission`,
    });
  const courthouse = getCourthouseByCourthouseId(req?.params?.courthouseId);
  if (!courthouse) return res.sendStatus(404);
  const { courthouse_name, display_name, region_id, security_group_ids } = req?.body;
  if (courthouse_name) courthouse.courthouse_name = courthouse_name;
  if (display_name) courthouse.display_name = display_name;
  if (region_id) courthouse.region_id = region_id;
  if (security_group_ids) {
    const securityRoles = localArray('securityRoles');
    const transcriberRole = securityRoles.value.find((securityRole) => securityRole.role_name === 'TRANSCRIBER');
    if (transcriberRole) {
      const securityGroups = localArray('securityGroups');
      const nonTranscriberGroups = securityGroups.value.filter(
        (securityGroup) => securityGroup.security_role_id !== transcriberRole.id
      );
      courthouse.security_group_ids = [
        ...nonTranscriberGroups.map((nonTranscriberGroup) => nonTranscriberGroup.id),
        ...security_group_ids.map((security_group_id) => parseInt(security_group_id)),
      ];
    }
  }

  const dateTimeNowIso = DateTime.now().toISO({ setZone: true });
  courthouse.last_modified_date_time = dateTimeNowIso;

  res.send(courthouse);
});

router.post('/', (req, res) => {
  const mandatoryKeys = ['courthouse_name', 'display_name'];
  if (!userIdHasAnyRoles([SUPER_ADMIN], req.headers.user_id))
    return res.status(403).send({
      detail: `You do not have permission`,
    });
  const requiredKeys = mandatoryKeys.filter((key) => !Object.keys(req.body).includes(key));
  if (requiredKeys.length)
    // If required keys are not included, return 400
    return res.status(400).send({
      title: 'Bad request',
      detail: `Required keys (${requiredKeys}) not in request`,
    });
  const highestIdCourthouse = courthouseList.reduce((prev, current) => (+prev.id > +current.id ? prev : current));
  // Generate a timestamp
  const dateTimeNowIso = DateTime.now().toISO({ setZone: true });
  const { courthouse_name, display_name, region_id, security_group_ids } = req?.body;
  // Create courthouse object
  const courthouse = {};
  // If region_id is included, add it to courthouse object
  if (region_id) courthouse.region_id = region_id;
  // If security_group_ids are included, add them to courthouse object
  if (security_group_ids)
    courthouse.security_group_ids = security_group_ids.map((security_group_id) => parseInt(security_group_id));
  // Add the rest
  courthouse.courthouse_name = courthouse_name;
  courthouse.display_name = display_name;
  // Generate a new ID based on the last item in the array
  courthouse.id = highestIdCourthouse.id + 1;
  // Create and last modified will be the same date
  courthouse.created_date_time = dateTimeNowIso;
  courthouse.last_modified_date_time = dateTimeNowIso;

  courthouseList.push(courthouse);
  res.send(courthouse);
});

module.exports = router;
