const { faker } = require("@faker-js/faker");
const tiers = ["beginner", "pro", "gold", "silver", "bronze", "platinum"];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDummyData() {
  const data = [];
  const numRecords = 100000;
  const startDate = new Date("1920-01-01");
  const endDate = new Date("2022-12-31");

  for (let i = 0; i < numRecords; i++) {
    const record = {
      _id: faker.string.uuid(),
      avatar: faker.image.avatar(),
      birthday: faker.date.between({
        from: "1920-01-01T00:00:00.000Z",
        to: "2023-01-01T00:00:00.000Z",
      }),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      sex: faker.person.sexType(),
      jobTitle: faker.person.jobTitle(),
      age: getRandomInt(18, 60),
      subscriptionTier: faker.helpers.arrayElement([
        "free",
        "basic",
        "business",
      ]),
    };
    data.push(record);
  }
  return data;
}

module.exports = {
  generateDummyData,
};
