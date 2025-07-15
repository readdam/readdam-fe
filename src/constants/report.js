export const CATEGORY_LABELS = {
  write_short: '읽담한줄',
  write: '글쓰기',
  write_comment: '첨삭',
  book_review: '책 후기',
  class_qna: '모임 질의',
  class_review: '모임 후기',
  other_place_review: '외부 장소 후기',
  place_review: '장소 후기',
};

export const STATUS_LABELS = {
  PENDING: '미처리',
  RESOLVED: '처리',
  REJECTED: '반려',
};

export const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  RESOLVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export const REASON_LABELS = {
  spam: '스팸/도배',
  inappropriate: '부적절한 내용',
  copyright: '저작권 침해',
  other: '기타',
};

export const REPORT_ROUTES = {
  write_short: () => '/writeShortList',
  write: (id) => `/writeDetail/${id}`,
  write_comment: (id) => `/writeDetail/${id}`,
  book_review: (isbn) => `/bookDetail/${isbn}`,
  class_qna: (id) => `/classDetail/${id}`,
  class_review: (id) => `/classDetail/${id}`,
  other_place_review: (id) => `/otherPlaceDetail/${id}`,
  place_review: (id) => `/placeDetail/${id}`,
};
