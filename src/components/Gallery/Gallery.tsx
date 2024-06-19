import styles from '../../css/Gallery/Gallery.module.css';
import logo from '../../assets/galleryLogo.svg';
import { useState, useEffect } from 'react';
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase/config";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Grid, Pagination } from 'swiper/modules';
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { useNavigate } from 'react-router-dom';

interface Postit {
  id: string;
  img: string;
  content: string;
  name: string;
  timestamp: string;
}

const Gallery: React.FC = () => {
  const [data, setData] = useState<Postit[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    listenForChanges();
  }, []);

  const listenForChanges = () => {
    const postitRef = ref(db, '/postit');

    onValue(postitRef, (snapshot) => {
      const postits: Postit[] = [];
      const data = snapshot.val();

      if (data) {
        Object.keys(data)
          .sort((a, b) => b.localeCompare(a)) 
          .forEach((key) => {
            const { img, content, name, timestamp } = data[key];
            postits.push({ id: key, img, content, name, timestamp });
          });
        setData(postits);
      } else {
        setData([]);
      }
    });
  };

  const handleHome = () => {
    nav('/')
  };

  const handleWrite = () => {
    nav('/qr')
  };

  const handleSearch = () => {
    nav('/search')
  };

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <p className={styles.home} onClick={handleHome}>HOME</p>
        <p className={styles.write} onClick={handleWrite}>포스트잇 작성하기</p>
        <p className={styles.search} onClick={handleSearch}>작품 검색하기</p>
      </div>
      <img src={logo} className={styles.title} alt="Gallery Logo" />
      <p className={styles.content}>여러분들의 소중한 마음이 담긴 포스트잇을 모아놓은 공간입니다.</p>

      <Swiper
        slidesPerView={5}
        grid={{
          rows: 2,
        }}
        spaceBetween={10}
        pagination={{
          clickable: true,
          type: 'bullets',
        }}
        autoplay={{
          delay: 2200,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Grid, Pagination, Autoplay]}
        className={styles.slider}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index} className={styles.post}>
            <div className={styles.img}>
              <img src={item.img} className={styles.img1} alt={`Postit ${item.id}`} />
              <p className={styles.postContent}>{item.content}</p>
            </div>
            <p className={styles.name}>{item.name}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Gallery;
