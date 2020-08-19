import auth from "./auth";
import profile from "./profile";
import trips from "./trips";
import acc from "./acc";
import transport from "./transport";

export default {
  ...auth,
  ...profile,
  ...trips,
  ...acc,
  ...transport,
};
