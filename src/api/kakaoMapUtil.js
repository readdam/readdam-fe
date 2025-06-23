

export const searchKakaoPlaces = (keyword, callback) => {
  if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
    alert('Kakao 지도 API가 아직 로드되지 않았습니다.');
    return;
  }

  const ps = new window.kakao.maps.services.Places();
  ps.keywordSearch(keyword, (data, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      callback(data);
    } else {
      alert('검색 결과가 없습니다.');
    }
  });
};
