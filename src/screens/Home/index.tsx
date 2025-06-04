import { FC } from "react";
import HomeView from "./HomeView";
import useHomeModel from "./useHomeModel";

const Home: FC = () => {
  const homeModel = useHomeModel();
  return <HomeView {...homeModel} />;
};

export default Home;
