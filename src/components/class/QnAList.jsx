import React, { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "../../atoms";
import {
  LockIcon,
  ImageIcon,
  StarIcon,
  SendIcon,
  MessageCircleIcon,
} from "lucide-react";
import axios from "axios";
import { url } from "../../config/config";


const QnAList = ({ classDetail }) => {
  const user = useAtomValue(userAtom); //로그인한 사용자 정보
  const [token] = useAtom(tokenAtom);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [showPrivate, setShowPrivate] = useState(false);
  const [answerInput, setAnswerInput] = useState({});
  const [expandedId, setExpandedId] = useState(false);
  const [qnaList, setQnaList] = useState([]);
  const [question, setQuestion] = useState('');
  const [secret, setSecret] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!user?.username);
    if (classDetail?.leaderUsername && user?.username) {
      setIsLeader(classDetail.leaderUsername === user.username);
    }
  }, [user, classDetail]);

  useEffect(() => {
    const fetchQnA = async () => {
      try {
        const res = await axios.get(`${url}/classQna/${classDetail.classId}`);
        setQnaList(res.data.data);
      } catch (err) {
        console.error("Q&A 목록조회 실패: ", err);
      }
    };
    if (classDetail?.classId) {
      fetchQnA();
    }
  }, [classDetail]);

  const submitQ = async () => {
    if(!question.trim()){
      alert('질문 내용을 입력해주세요.');
      return;
    }

    try{
      await axios.post(`${url}/classQna`, {
        classId: classDetail.classId,
        content: question,
        isSecret: showPrivate
      }, {
        headers: {
        Authorization: token.access_token  // ✅ 헤더에 토큰 추가
      }
    });
      alert('질문이 등록되었습니다.');
      setQuestion('');
      setSecret(false);
      // onSubmitted();  // 목록 새로고침
    } catch(err){
      console.log('질문 등록 실패: ', err);
      alert('질문 등록 중 오류가 발생했습니다.');
    }
  };

  const HandleAccordionToggle = (classQnaId) => {
    setExpandedId((prev) => (prev === classQnaId ? null : classQnaId));
  };

  const handleAnswerChange = (classQnaId, value) => {
    setAnswerInput((prev) => ({ ...prev, [classQnaId]: value }));
  };

  const submitAnswer = async (classQnaId) => {
    const answer = answerInput[classQnaId];
    if (!answer || answer.trim() === "") {
      alert("답변 내용을 입력해주세요.");
      return;
    }
    try {
      await axios.post(
        `${url}/classQnaAnswer`,
        {
          classQnaId,
          answer,
        },
        {
          headers: {
            Authorization: token.access_token,
          },
        }
      );
      alert("답변이 등록되었습니다.");
      //   console.log("답변 등록 성공: ", res.data);
      setAnswerInput((prev) => ({ ...prev, [classQnaId]: "" }));
      // 답변 반영 후 다시 불러오기
      const res = await axios.get(`${url}/classQna/${classDetail.classId}`);
      setQnaList(res.data.data);
    } catch (err) {
      console.error("답변 등록 실패: ", err);
      alert("답변 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">모임 Q&A</h3>

      {/* 로그인 한 사용자만 질문 가능 */}
      {isLoggedIn ? (
        <div className="mb-6">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg resize-none mb-2"
            rows={3}
            placeholder="모임에 대해 궁금한 점을 물어보세요"
            value={question}
            onChange={(e)=> setQuestion(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showPrivate}
                onChange={(e) => setShowPrivate(e.target.checked)}
                className="mr-2"
              />
              모임장에게만 보이기
              <LockIcon className="w-4 h-4 ml-1" />
            </label>
            <button
              onClick={submitQ} 
              className="px-4 py-2 bg-[#006989] text-white rounded-lg hover:bg-[#005C78] transition-colors">
              등록
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">질문을 작성하려면 로그인이 필요해요.</p>
      )}
      
      {/* 예시 Q&A 목록 (아코디언 스타일로) */}
      <div className="space-y-4">
        {qnaList.map((item) => {
          const isSecret = item.isSecret;
          const isOwner = user.username === item.username;
          const canView = !isSecret || isOwner || isLeader;

          return (
            <div key={item.classQnaId} className="border rounded p-4 bg-gray-50">
              <button onClick={() => HandleAccordionToggle(item.classQnaId)}
                className="w-full text-left">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {/* <img src={item.writerProfile || '/default-profile.png'}
                      alt="writer"
                      className="w-8 h-8 rounded-full"/> */}
                      <span className="font-semibold">{item.username}</span>
                      {isSecret && (
                        <span className="text-sm text-gray-500">(비밀글)</span>
                      )}
                  </div>
                      <span>{item.regDate}</span>
                </div>
              </button>

              {expandedId === item.classQnaId && canView && (
                <div className="mt-4">
                  <p className="mb-2 text-gray-700 whitespace-pre-line">{item.content}</p>

                  {item.answer ? (
                    <div className="p-3 bg-white border rounded text-gray-800">
                    <p className="text-sm font-medium mb-1">모임장 답변</p>
                    <p className="whitespace-pre-line">{item.answer}</p>
                  </div>
                  ) : (
                    isLeader &&
                    (!isSecret || item.username === user.username || isLeader) && (
                      <div className="mt-4">
                        <textarea
                          className="w-full border rounded p-2"
                          placeholder="답변을 입력하세요"
                          value={answerInput[item.classQnaId] || ""}
                          onChange={(e) => handleAnswerChange(item.classQnaId, e.target.value)}
                        />
                        <button
                          className="mt-2 px-4 py-2 bg-[#E88D67] text-white rounded"
                          onClick={() => submitAnswer(item.classQnaId)}
                        >
                          답변 등록
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* 이 부분은 실제 질문 리스트 데이터로 반복 렌더링
        {[
          {
            id: 1,
            content: "모임은 몇 시에 시작하나요?",
            secret: false,
            writer: "user1",
          },
        ].map((item) => (
          <details key={item.id} className="bg-gray-50 p-4 rounded">
            <summary className="cursor-pointer font-medium text-gray-800">
              {item.secret && !isLeader && item.writer !== user.username
                ? "비밀글입니다."
                : item.content}
            </summary> 

            
          </details>
        ))} */}
      </div>
    </div>
  );
};
export default QnAList;
