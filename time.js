const time = (unixTime) => {
  const generalTime = new Date(unixTime * 1000);
  const year = generalTime.getFullYear();
  const month = generalTime.getMonth() + 1;
  const day = generalTime.getDate();
  const hours =
    generalTime.getHours().toString().length === 1
      ? `0${generalTime.getHours()}`
      : generalTime.getHours().toString();
  const minutes =
    generalTime.getMinutes().toString().length === 1
      ? `0${generalTime.getMinutes()}`
      : generalTime.getMinutes().toString();
  return { year, month, day, hours, minutes };
};

export default time;
