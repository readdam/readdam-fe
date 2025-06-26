import { BookOpenIcon, HeartIcon, MessageSquareIcon, EyeIcon, ClockIcon } from 'lucide-react';
import TimeRemainingText from './TimeRemainingText';
import { url } from '../../config/config';

const typeMap = {
  bookreview: '독후감',
  essay: '수필',
  personal: '자기소개서',
  assignment: '과제',
  other: '기타',
};

const getReviewStatus = (endDate) => {
  if (!endDate) return '첨삭 제외';
  const now = new Date();
  return new Date(endDate) > now ? '첨삭 가능' : '첨삭 종료';
};

const WriteCard = ({ post, variant = 'list', onClick }) => {
  const tags = [post.tag1, post.tag2, post.tag3, post.tag4, post.tag5].filter(Boolean);
  const reviewStatus = getReviewStatus(post.endDate);
  const statusClass = reviewStatus === '첨삭 가능' ? 'text-[#006989] font-semibold' : 'text-gray-400 font-semibold';

  return (
    <div
      className="cursor-pointer bg-white rounded-lg p-4 flex gap-4 hover:shadow-sm transition-shadow"
      onClick={onClick}
    >
      {post.img ? (
        <img src={`${url}/image?filename=${post.img}`} alt="" className="w-48 h-48 object-cover rounded-lg flex-shrink-0" />
      ) : (
        <div className="w-48 h-48 bg-[#F3D5C9] rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpenIcon className="w-12 h-12 text-[#E88D67]" />
        </div>
      )}

      <div className="flex-1">
        <div className="flex gap-2 mb-2">
          <span className="px-3 py-1 text-sm rounded-full bg-[#F3F7EC] text-[#006989]">
            {typeMap[post.type]}
          </span>
          <span className={`px-3 py-1 text-sm ${statusClass}`}>{reviewStatus}</span>
        </div>

        {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 mb-2">
            {tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-1 text-xs rounded-full bg-[#FDF3F0] text-[#E88D67]">
                #{tag}
            </span>
            ))}
        </div>
        )}

        <h3 className="text-lg font-bold mb-2">{post.title}</h3>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="font-medium text-[#006989]">{post.nickname || post.username?.nickname}</span>
          <span className="mx-2">• 등록일 </span>
          <span>{post.regDate?.split('T')[0]}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1"><HeartIcon className="w-4 h-4 text-[#E88D67]" />{post.likeCnt || 0}</div>
          <div className="flex items-center gap-1"><MessageSquareIcon className="w-4 h-4 text-[#006989]" />{post.commentCnt || 0}</div>
          <div className="flex items-center gap-1"><EyeIcon className="w-4 h-4" />{post.viewCnt || 0}</div>
          {variant !== 'detail' && post.endDate && (
            <div className="flex items-center gap-1 ml-auto">
              <span><TimeRemainingText endDate={post.endDate} /></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteCard;
