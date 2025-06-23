import React, { useState } from "react";
import { useAtom } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import axios from "axios";
import { url } from "../../config/config";
import {
  CalendarIcon,
  ImageIcon,
  MapPinIcon,
  SearchIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";

const ClassCreate = () => {
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    tags: [],
    minParticipants: "",
    maxParticipants: "",
    sessionCount: 3,
    venue: "읽담",
    venueName: "",
    venueAddress: "",
    dates: [],
    sessionDetails: Array(3).fill({
      description: "",
    }),
    description: "",
    leaderDescription: "",
  });

  // 이미지(미리보기용 포함)
  const [mainImgF, setMainImgF] = useState("");
  const [mainImgFPreview, setMainImgFPreview] = useState("");

  const [leaderImgF, setLeaderImgF] = useState("");
  const [leaderImgFPreview, setLeaderImgFPreview] = useState("");

  const [roundImgs, setRoundImgs] = useState({
    round1ImgF: "",
    round1BookimgF: "",
    round2ImgF: "",
    round2BookimgF: "",
    round3ImgF: "",
    round3BookimgF: "",
    round4ImgF: "",
    round4BookimgF: "",
  });
  const [roundImgPreviews, setRoundImgPreviews] = useState({});

  const handleRoundImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setRoundImgs((prev) => ({
        ...prev,
        [field]: file,
      }));
      setRoundImgPreviews((prev) => ({
        ...prev,
        [field]: URL.createObjectURL(file),
      }));
    }
  };

  const handleMainImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImgF(file);
      setMainImgFPreview(URL.createObjectURL(file));
    }
    console.log("mainImgF file:", file);
  };

  const removeMainImgF = (e) => {
    e.preventDefault();
    setMainImgF("");
    setMainImgFPreview("");
  };

  const handleLeaderImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLeaderImgF(file);
      setLeaderImgFPreview(URL.createObjectURL(file));
    }
  };

  const removeLeaderImgF = (e) => {
    e.preventDefault();
    setLeaderImgF("");
    setLeaderImgFPreview("");
  };

  const [token] = useAtom(tokenAtom);
  const [user] = useAtom(userAtom);
  const [showTempSaveModal, setShowTempSaveModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", form);
    const submitData = new FormData();
    submitData.append("title", form.title);
    submitData.append("shortIntro", form.shortDescription);
    submitData.append("minPerson", String(form.minParticipants ?? ""));
    submitData.append("maxPerson", String(form.maxParticipants ?? ""));
    submitData.append("classIntro", form.description);
    submitData.append("leaderIntro", form.leaderDescription);
    submitData.append("leaderUsername", user.username);

    //태그 파싱
    const tagArray = form.tags.map((tag) => tag.trim()).filter((tag) => tag); // 공백 제거 + 빈 문자열 제거
    submitData.append("tag1", tagArray[0] || "");
    submitData.append("tag2", tagArray[1] || "");
    submitData.append("tag3", tagArray[2] || "");

    // 이미지 append
    // 대표 이미지
    if (mainImgF) {
      submitData.append("mainImgF", mainImgF);
      submitData.append("mainImg", mainImgF.name);
    }
    // 리더 이미지
    if (leaderImgF) {
      submitData.append("leaderImgF", leaderImgF);
      submitData.append("leaderImg", leaderImgF.name);
    }
    // 회차 이미지들
    Object.entries(roundImgs).forEach(([key, file]) => {
      if (file) {
        submitData.append(key, file);
        const nameKey = key.replace("ImgF", "Img");
        submitData.append(nameKey, file.name);
      }
    });

    // === 회차별 공통 필드 ===
    const sessionCount = form.sessionCount;

    for (let i = 0; i < sessionCount; i++) {
      const round = i + 1; // 1-based
      const date = form.dates[i] || ""; // YYYY-MM-DD
      const datetime = date ? `${date}T10:00:00` : ""; // ISO 형식으로 변환

      submitData.append(`round${round}Date`, datetime);
      submitData.append(`round${round}PlaceName`, form.venueName || "");
      submitData.append(`round${round}PlaceLoc`, form.venueAddress || "");
      submitData.append(
        `round${round}Content`,
        form.sessionDetails[i]?.description || ""
      );
      submitData.append(`round${round}Bookname`, ""); // 책 제목 (추후 구현)
      submitData.append(`round${round}Bookwriter`, ""); // 책 저자
      submitData.append(`round${round}Lat`, ""); // 위도
      submitData.append(`round${round}Log`, ""); // 경도
    }

    // submitData 전송 확인 로그
    for (let [key, value] of submitData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // 데이터 전송(axios)
    console.log(token);
    console.log("axios 전송 시작");
    axios
      .post(`${url}/my/createClass`, submitData, {
        headers: {
          Authorization: token.access_token,
        },
      })
      .then((res) => {
        console.log(res);
        navigate(`/classDetail/${res.data.classId}`);
      })
      .catch((err) => {
        console.log("axios에러 발생:", err);
      });
  };

  const addDays = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  //임시저장
  const handleTempSave = () => {
    setShowTempSaveModal(true);
    // 임시저장 로직 추가 예정
    console.log("Temporary saved:", form);
  };

  const handleTagToggle = (tag) => {
    if (form.tags.includes(tag)) {
      setForm({
        ...form,
        tags: form.tags.filter((t) => t !== tag),
      });
    } else if (form.tags.length < 3) {
      setForm({
        ...form,
        tags: [...form.tags, tag],
      });
    }
  };

  // 모임회차 선택(3회, 4회)에 따라 회차별 진행 상세내용 입력
  const handleSessionCountChange = (count) => {
    setForm({
      ...form,
      sessionCount: count,
      sessionDetails: Array(count).fill({
        description: "",
      }),
      dates: [],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-[1200px]">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              모임 만들기
            </h1>
            <p className="text-sm text-red-500 mb-6">
              * 표시된 항목은 필수 입력 사항입니다.
            </p>
            {/* 기본 정보 영역 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  모임 제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  placeholder="모임의 제목을 입력해주세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  모임 한 줄 소개 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={form.shortDescription}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      shortDescription: e.target.value,
                    })
                  }
                  placeholder="모임을 한 줄로 소개해주세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  태그 설정 <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  최대 3개 복수 선택 가능
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "모임 초보 환영",
                    "독서 습관 형성",
                    "독서 취향 공유",
                    "무거운 책 가볍게 얘기하기",
                    "가벼운 책 깊게 다루기",
                    "책 고수 환영",
                    "한 주제 X 여러 책",
                    "한 작품 X 여러 주제",
                    "발제 있어요",
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        form.tags.includes(tag)
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* 모임 상세정보 영역 */}
          <div className="bg-white p-8 rounded-lg shadow space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              모임 상세정보
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  모집 인원 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    value={form.minParticipants}
                    onChange={(e) => {
                      const newMin = parseInt(e.target.value);
                      const adjustedmax =
                        form.maxParticipants < newMin
                          ? newMin
                          : form.maxParticipants;
                      setForm({
                        ...form,
                        minParticipants: newMin,
                        maxParticipants: adjustedmax,
                      });
                    }}
                  >
                    <option value="" disabled>
                      최소 인원 선택
                    </option>
                    {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num}명
                      </option>
                    ))}
                  </select>
                  <span>~</span>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                    value={form.maxParticipants}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        maxParticipants: parseInt(e.target.value),
                      })
                    }
                    disabled={!form.minParticipants} //비활성화 조건
                  >
                    <option value="" disabled>
                      최대 인원 선택
                    </option>
                    {[4, 5, 6, 7, 8, 9, 10]
                      .filter((num) => num >= form.minParticipants)
                      .map((num) => (
                        <option key={num} value={num}>
                          {num}명
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  모임 회차 선택
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleSessionCountChange(3)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      form.sessionCount === 3
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    3회차
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSessionCountChange(4)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      form.sessionCount === 4
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    4회차
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                장소 선택
              </label>
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      venue: "읽담",
                    })
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    form.venue === "읽담"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  읽담
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      venue: "외부",
                    })
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    form.venue === "외부"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  외부
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="장소 이름"
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                    form.venue === "읽담" ? "bg-gray-100" : ""
                  }`}
                  disabled={form.venue === "읽담"}
                  value={form.venueName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      venueName: e.target.value,
                    })
                  }
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="주소 검색"
                    className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg ${
                      form.venue === "읽담" ? "bg-gray-100" : ""
                    }`}
                    disabled={form.venue === "읽담"}
                    value={form.venueAddress}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        venueAddress: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    disabled={form.venue === "읽담"}
                    className={`px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <SearchIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                모임 일정 선택
              </label>
              <div className="space-y-4">
                {Array.from({
                  length: form.sessionCount,
                }).map((_, index) => {
                  const prevDate = form.dates[index - 1];
                  const minDate = prevDate ? addDays(prevDate, 1) : undefined;

                  return (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 w-20">
                        {index + 1}회차:
                      </span>
                      <input
                        type="date"
                        disabled={index > 0 && !form.dates[index - 1]}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                        value={form.dates[index] || ""}
                        min={minDate}
                        onChange={(e) => {
                          const newDates = [...form.dates];
                          newDates[index] = e.target.value;
                          setForm({
                            ...form,
                            dates: newDates,
                          });
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                회차별 진행 상세 내용
              </label>
              <div className="space-y-6">
                {Array.from({
                  length: form.sessionCount,
                }).map((_, index) => {
                  const roundField = `round${index + 1}ImgF`; // 고유 key
                  return (
                    <div key={index} className="p-6 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">
                        {index + 1}회차 진행 상세 내용
                      </h3>
                      <div className="flex gap-4 mb-4">
                        <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                          {/* 이미지가 없을 때만 아이콘 + 문구 보여줌 */}
                          {!roundImgPreviews[roundField] && (
                            <>
                              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                              <label className="text-sm text-gray-500">
                                이미지 업로드
                              </label>
                            </>
                          )}
                          {roundImgPreviews[roundField] && (
                            <img
                              src={roundImgPreviews[roundField]}
                              alt="미리보기"
                              className="w-32 h-32 object-cover mt-2"
                            />
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleRoundImageChange(e, roundField)
                            }
                            className="hidden"
                          />
                        </label>
                        <textarea
                          className="flex-1 p-4 border border-gray-300 rounded-lg resize-none h-32"
                          placeholder={`${
                            index + 1
                          }회차 진행 내용을 입력해주세요`}
                          value={form.sessionDetails[index]?.description || ""}
                          onChange={(e) => {
                            const newDetails = [...form.sessionDetails];
                            newDetails[index] = {
                              ...newDetails[index],
                              description: e.target.value,
                            };
                            setForm({
                              ...form,
                              sessionDetails: newDetails,
                            });
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        북커버 이미지 검색
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* 추가 정보 영역 */}
          <div className="bg-white p-8 rounded-lg shadow space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">추가 정보</h2>
            <div>
              <label
                htmlFor="mainImgUpload"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                대표 이미지 <span className="text-red-500">*</span>
              </label>
              <label
                htmlFor="mainImgUpload"
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
              >
                {/* 이미지가 없을 때만 아이콘 + 문구 보여줌 */}
                {!mainImgFPreview && (
                  <>
                    <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      모임의 대표 이미지를 업로드해주세요
                    </span>
                  </>
                )}
                {/* 이미지가 있을 때만 미리보기 표시 */}
                {mainImgFPreview && (
                  <div className="relative w-40 h-40 mt-2">
                    <img
                      src={mainImgFPreview}
                      alt="미리보기"
                      className="w-40 h-40 object-cover rounded-md"
                    />
                    <button
                      onClick={removeMainImgF}
                      className="absolute top-2 right-2 bg-white text-gray-600 border rounded-full p-1 hover:text-red-500"
                      type="button"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <input
                  id="mainImgUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleMainImgChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                모임 상세소개 <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none"
                placeholder="모임에 대해 자세히 소개해주세요"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                모임 리더 소개
              </label>
              <div className="flex gap-4">
                <label
                  htmlFor="leaderImgUpload"
                  className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                >
                  {/* 이미지가 없을 때만 아이콘 + 문구 보여줌 */}
                  {!leaderImgFPreview && (
                    <>
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        이미지 업로드
                      </span>
                    </>
                  )}
                  {/* 이미지가 있을 때만 미리보기 표시 */}
                  {leaderImgFPreview && (
                    <div className="relative w-40 h-40">
                      <img
                        src={leaderImgFPreview}
                        alt="미리보기"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                      <button
                        onClick={removeLeaderImgF}
                        className="absolute top-1 right-1 bg-white text-gray-600 border rounded-full p-1 hover:text-red-500"
                        type="button"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <input
                    id="leaderImgUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleLeaderImgChange}
                    className="hidden"
                  />
                </label>
                <textarea
                  className="flex-1 p-4 border border-gray-300 rounded-lg resize-none h-32"
                  placeholder="모임 리더님을 소개해주세요"
                  value={form.leaderDescription}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      leaderDescription: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={handleTempSave}
              className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              임시저장
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
            >
              등록
            </button>
          </div>
        </form>
      </main>
      {/* 임시저장 모달 */}
      {showTempSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <p className="text-lg mb-4">작성하신 글이 임시저장 됐습니다.</p>
            <button
              onClick={() => setShowTempSaveModal(false)}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ClassCreate;
