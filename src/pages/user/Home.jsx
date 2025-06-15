import Banner from '@components/home/Banner';
import HomeClass from '@components/home/HomeClass';
import HomePlace from '@components/home/HomePlace';
import HomeWrite from '@components/home/HomeWrite';
import HomeShort from '@components/home/HomeShort';
import About from '@components/home/About';

const Home = () => {
  return (
    <div className="space-y-16">
      <Banner />
      <HomeClass />
      <HomePlace />
      <HomeWrite />
      <HomeShort />
      <About />
    </div>
  );
};

export default Home;