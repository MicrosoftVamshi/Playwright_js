function uniqueUser(prefix = "user") {
  const ts = Date.now();
  const rnd = Math.floor(Math.random() * 100000);
  return {
    username: `${prefix}_${ts}_${rnd}`,
    password: `Pass@${ts}_${rnd}`
  };
}

function purchaseDetails() {
  return {
    name: "Vamshi",
    country: "India",
    city: "Hyderabad",
    card: "4111111111111111",
    month: "04",
    year: "2030"
  };
}

module.exports = { uniqueUser, purchaseDetails };
