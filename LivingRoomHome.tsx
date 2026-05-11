import React, { useEffect, useRef, useState } from "react";

type ShelfItem = {
  title: string;
  path: string;
  accent: string;
};

type CoffeeEntry = {
  name: string;
  date: string;
  note: string;
  mood: string;
};

interface LivingRoomHomeProps {
  className?: string;
  onNavigate?: (path: string) => void;
}

const books: ShelfItem[] = [
  { title: "薄暮笔记", path: "/essays/book-1", accent: "#D98F70" },
  { title: "午后信笺", path: "/essays/book-2", accent: "#B58AA5" },
  { title: "风里微光", path: "/essays/book-3", accent: "#8FAF8B" },
];

const records: ShelfItem[] = [
  { title: "雨巷回声", path: "/music/record-1", accent: "#DDAA73" },
  { title: "柚子色晚风", path: "/music/record-2", accent: "#91B5C8" },
  { title: "窗边夜曲", path: "/music/record-3", accent: "#C78C7C" },
];

const coffeeEntries: CoffeeEntry[] = [
  {
    name: "桂花拿铁",
    date: "2026-05-09",
    note: "奶泡里有一点花香，像傍晚厨房里刚亮起的小灯。",
    mood: "轻松",
  },
  {
    name: "冰美式",
    date: "2026-05-06",
    note: "赶稿上午的清醒按钮，杯壁的水珠也很有夏天感。",
    mood: "清透",
  },
  {
    name: "焦糖燕麦拿铁",
    date: "2026-05-02",
    note: "入口柔和，适合窝在沙发上读半小时书。",
    mood: "治愈",
  },
];

const navItems = [
  { label: "首页", path: "/" },
  { label: "随笔林间", path: "/essays" },
  { label: "流光碎影", path: "/moments" },
  { label: "灵魂角落", path: "/soul-corner" },
  { label: "暖心寄语", path: "/guestbook" },
];

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
      <path
        d="M36 14 18 32l18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 32h26"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
      <rect
        x="10"
        y="16"
        width="44"
        height="32"
        rx="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <path
        d="M14 20 32 34 50 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WallShelf({
  books,
  records,
  onJump,
}: {
  books: ShelfItem[];
  records: ShelfItem[];
  onJump: (path: string) => void;
}) {
  return (
    <section>
      {/* 书架区 */}
      <div className="relative rounded-[24px] border-[3px] border-[#ab7b4f] bg-[#f6e6cd]/88 px-5 pb-5 pt-6 shadow-[0_14px_35px_rgba(125,90,60,0.10)]">
        <div className="absolute left-4 top-3 h-2 w-16 rounded-full bg-[#e8c9a6]" />
        <p className="mb-4 text-sm font-medium text-[#8b5e3c]">书架小角落</p>

        <div className="space-y-7">
          <div className="relative h-20">
            <div className="wood-grain absolute inset-x-0 bottom-0 h-3 rounded-full border-2 border-[#9b6d44] bg-[#cf9f72]" />
            <div className="relative flex h-full items-end justify-between px-2">
              {books.map((item, index) => (
                <button
                  key={item.path}
                  type="button"
                  title={item.title}
                  onClick={() => onJump(item.path)}
                  className="group relative flex cursor-pointer items-end justify-center transition hover:-translate-y-1.5 hover:scale-[1.04]"
                >
                  <span
                    className="flex w-[68px] flex-col items-center rounded-t-[10px] border-[3px] border-[#8b5e3c] shadow-[0_6px_14px_rgba(109,74,42,0.10)]"
                    style={{
                      height: `${70 + index * 6}px`,
                      backgroundColor: item.accent,
                    }}
                  >
                    <span className="mt-3 h-8 w-[2px] rounded-full bg-[#fff7ea]/70" />
                    <span className="absolute -bottom-6 rounded-full bg-[#fff8ef] px-2 py-1 text-[10px] text-[#7a5337] opacity-0 shadow transition group-hover:-translate-y-1 group-hover:opacity-100">
                      {item.title}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-20">
            <div className="wood-grain absolute inset-x-0 bottom-0 h-3 rounded-full border-2 border-[#9b6d44] bg-[#cf9f72]" />
            <div className="relative flex h-full items-end justify-between px-3">
              {records.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  title={item.title}
                  onClick={() => onJump(item.path)}
                  className="group relative flex cursor-pointer items-center justify-center transition hover:-translate-y-1.5 hover:scale-[1.05]"
                >
                  <span
                    className="relative flex h-[62px] w-[62px] items-center justify-center rounded-full border-[3px] border-[#6a4630] shadow-[0_7px_16px_rgba(109,74,42,0.12)]"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 50%, #f8eedf 0 10%, #2b221d 10% 54%, #5d3f2d 54% 63%, " +
                        item.accent +
                        " 63% 100%)",
                    }}
                  >
                    <span className="h-3 w-3 rounded-full bg-[#f9f0df]" />
                    <span className="absolute -bottom-6 rounded-full bg-[#fff8ef] px-2 py-1 text-[10px] text-[#7a5337] opacity-0 shadow transition group-hover:-translate-y-1 group-hover:opacity-100">
                      {item.title}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PostcardWall({ onJump }: { onJump: (path: string) => void }) {
  const cards = [
    { title: "海边晚霞", rotate: "-rotate-3" },
    { title: "山路日光", rotate: "rotate-2" },
    { title: "窗边手账", rotate: "rotate-1" },
    { title: "列车小憩", rotate: "-rotate-2" },
  ];

  return (
    <section>
      {/* 照片墙 / 明信片区 */}
      <div className="rounded-[26px] border-[3px] border-dashed border-[#b98d63] bg-[#fbf3e6]/84 px-4 py-5 shadow-[0_14px_35px_rgba(125,90,60,0.08)]">
        <p className="mb-4 text-sm font-medium text-[#8b5e3c]">旅行明信片</p>
        <div className="grid grid-cols-2 gap-3">
          {cards.map((card, index) => (
            <button
              key={card.title}
              type="button"
              title={`打开 ${card.title}`}
              onClick={() => onJump("/moments")}
              className={`group relative cursor-pointer rounded-[18px] border-[2.5px] border-[#9f734d] bg-[#fffaf3] p-2 text-left shadow-[0_10px_24px_rgba(109,74,42,0.10)] transition hover:-translate-y-1.5 hover:scale-[1.03] ${card.rotate}`}
            >
              <span className="absolute left-1/2 top-0 h-3 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ead0a9]" />
              <span
                className="block h-24 rounded-[12px] border-2 border-[#d6b38d]"
                style={{
                  background:
                    index % 2 === 0
                      ? "linear-gradient(180deg, #f7d9b0 0%, #d9b6a2 38%, #95b8c5 100%)"
                      : "linear-gradient(180deg, #e8cfaf 0%, #c99a6b 42%, #889f78 100%)",
                }}
              />
              <span className="mt-2 block text-xs text-[#7c5739]">{card.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function MessageBoard() {
  return (
    <section className="w-full max-w-[320px]">
      {/* 留言板 */}
      <div className="rounded-[24px] border-[3px] border-[#9b6a45] bg-[#cfa77a] p-3 shadow-[0_12px_28px_rgba(109,74,42,0.10)]">
        <div className="wood-grain rounded-[18px] border-[2px] border-[#8b5e3c] bg-[#d7ae82] p-3">
          <div className="message-note relative rounded-[18px] border-[2px] border-[#d0aa7f] bg-[#fff8ef] px-4 py-5 shadow-[0_8px_18px_rgba(109,74,42,0.08)] transition">
            <span className="absolute left-1/2 top-0 h-4 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f0d6b2]" />
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#c18c5b]">暖心寄语</p>
            <p className="text-sm leading-7 text-[#775235]">
              愿你今天也能在小小的日常里，找到一点温柔的光。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MusicPlayer({
  isPlaying,
  onToggle,
}: {
  isPlaying: boolean;
  onToggle: () => void;
}) {
  return (
    <section className="w-full">
      {/* 音乐区 */}
      <button
        type="button"
        onClick={onToggle}
        className="group w-full cursor-pointer rounded-[28px] border-[3px] border-[#8f6242] bg-[#f7ead6]/94 p-4 text-left shadow-[0_18px_30px_rgba(109,74,42,0.10)] transition hover:-translate-y-1.5 hover:scale-[1.01]"
      >
        <p className="mb-3 text-sm font-medium text-[#8b5e3c]">音乐留声机</p>
        <div className="relative h-[190px] rounded-[22px] border-[3px] border-[#9a6d46] bg-[#d8b087] p-4">
          <div className="wood-grain absolute inset-0 rounded-[18px] opacity-60" />
          <div className="relative flex h-full gap-4">
            <div className="flex flex-1 items-center justify-center rounded-[18px] border-[3px] border-[#8b5e3c] bg-[#bd8f64]">
              <div
                className={`relative flex h-[112px] w-[112px] items-center justify-center rounded-full border-[5px] border-[#2d2420] bg-[radial-gradient(circle_at_center,_#fbf2e4_0_10px,_#231c18_10px_56px,_#594032_56px_66px,_#14110f_66px_100%)] ${
                  isPlaying ? "record-spinning" : ""
                }`}
              >
                <div className="h-4 w-4 rounded-full bg-[#fbf2e4]" />
                <div className="absolute h-[78px] w-[78px] rounded-full border border-[#6e5744]/60" />
              </div>
            </div>

            <div className="relative w-[106px] shrink-0 rounded-[18px] border-[3px] border-[#8b5e3c] bg-[#f8f1e3]">
              <div className="absolute left-5 top-4 h-8 w-12 rounded-t-full border-[3px] border-b-0 border-[#6a4630] bg-[#2d2420]" />
              <div className="absolute left-[58px] top-[38px] h-[56px] w-[6px] origin-top rotate-[25deg] rounded-full bg-[#7d5a3c]" />
              <div className="absolute left-[77px] top-[82px] h-5 w-5 rounded-full border-[3px] border-[#6a4630] bg-[#f0d9bb]" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <span className="h-3 w-3 rounded-full bg-[#cf9164]" />
                <span className="h-3 w-3 rounded-full bg-[#e2c174]" />
                <span className="h-3 w-3 rounded-full bg-[#9ab392]" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <div>
            <p className="text-[#7a5537]">今日播放：A soft evening song</p>
            <p className="text-xs text-[#aa7e56]">
              {isPlaying ? "点击暂停这一刻的晚风" : "点击让黑胶慢慢转起来"}
            </p>
          </div>
          <span className="rounded-full border border-[#d6b089] bg-[#fff8ef] px-3 py-1 text-xs text-[#8b5e3c]">
            {isPlaying ? "播放中" : "已暂停"}
          </span>
        </div>
      </button>
    </section>
  );
}

function CoffeeCorner({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="w-full">
      {/* 咖啡角 */}
      <button
        type="button"
        onClick={onOpen}
        className="group relative w-full cursor-pointer rounded-[30px] border-[3px] border-[#8c6242] bg-[#f6e7d0]/94 px-5 pb-5 pt-4 text-left shadow-[0_18px_30px_rgba(109,74,42,0.10)] transition hover:-translate-y-1.5 hover:scale-[1.01]"
      >
        <p className="mb-4 text-sm font-medium text-[#8b5e3c]">咖啡角</p>
        <div className="relative h-[180px] rounded-[22px] border-[3px] border-[#9f734d] bg-[#e7c299] p-3">
          <div className="wood-grain absolute inset-0 rounded-[18px] opacity-55" />
          <div className="relative h-full">
            <div className="absolute left-4 top-4 h-[112px] w-[104px] rounded-[24px] border-[4px] border-[#6f4930] bg-[#f3eadc]">
              <div className="absolute left-4 top-4 h-5 w-14 rounded-full border-[3px] border-[#6f4930] bg-[#d3a275]" />
              <div className="absolute right-3 top-4 h-8 w-8 rounded-full border-[3px] border-[#6f4930] bg-[#2d241f]" />
              <div className="absolute left-5 top-[48px] h-10 w-12 rounded-b-[18px] rounded-t-[10px] border-[3px] border-[#6f4930] bg-[#b8d2d6]" />
              <div className="absolute left-11 top-[82px] h-8 w-1 rounded-full bg-[#7d5739]" />
              <div className="absolute left-6 top-[90px] h-4 w-12 rounded-full border-[3px] border-[#6f4930] bg-[#d2a176]" />
            </div>

            <div className="absolute left-[126px] top-[84px] h-12 w-14 rounded-b-[18px] rounded-t-[8px] border-[3px] border-[#6f4930] bg-[#fff8ef]">
              <div className="absolute right-[-11px] top-2 h-6 w-4 rounded-r-full border-[3px] border-l-0 border-[#6f4930]" />
              <div className="absolute inset-x-2 top-2 h-4 rounded-full bg-[#c98c58]" />
            </div>

            <div className="absolute bottom-3 left-[116px] h-7 w-20 rounded-[16px] border-[3px] border-[#8b5e3c] bg-[#f4dcc0]" />
            <div className="absolute bottom-7 left-[126px] h-3 w-3 rounded-full bg-[#8b5e3c]" />
            <div className="absolute bottom-8 left-[142px] h-2.5 w-2.5 rounded-full bg-[#7a5032]" />
            <div className="absolute bottom-6 left-[155px] h-3 w-3 rounded-full bg-[#9b6c44]" />

            <div className="absolute right-4 top-6 h-[88px] w-[78px] rounded-[18px] border-[3px] border-[#8f6242] bg-[#f3e2cb]">
              <div className="absolute left-3 top-5 h-5 w-12 rounded-full bg-[#e2b279]" />
              <div className="absolute left-3 top-12 h-5 w-12 rounded-full bg-[#fff3df]" />
              <div className="absolute left-3 top-[56px] h-6 w-12 rounded-full border-[3px] border-[#8f6242] bg-transparent" />
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-[#7a5537]">点开看看最近做过的三杯咖啡。</p>
      </button>
    </section>
  );
}

function CenterDecorDesktop() {
  return (
    <section className="relative h-full w-full">
      {/* 装饰家具 */}
      <div className="absolute left-[8%] top-[18%] h-[220px] w-[120px]">
        <div className="lamp-glow absolute left-[-30px] top-[-10px] h-36 w-36 rounded-full bg-[#ffe6a7]/55 blur-2xl" />
        <div className="absolute left-[35px] top-0 h-0 w-0 border-x-[26px] border-b-[64px] border-x-transparent border-b-[#f5e3bf]" />
        <div className="absolute left-[47px] top-[62px] h-[118px] w-[8px] rounded-full bg-[#8b5e3c]" />
        <div className="absolute left-[24px] top-[176px] h-6 w-16 rounded-full border-[3px] border-[#8b5e3c] bg-[#d5ab80]" />
      </div>

      <div className="absolute bottom-[10px] left-1/2 h-[210px] w-[440px] -translate-x-1/2">
        <div className="absolute inset-x-[14px] bottom-0 h-[44px] rounded-[999px] bg-[#c48e5e]/40 blur-xl" />
        <div className="absolute left-0 top-[48px] h-[132px] w-[440px] rounded-[52px] border-[4px] border-[#8f6242] bg-[#e5bf9d]" />
        <div className="absolute left-[28px] top-[30px] h-[86px] w-[384px] rounded-[38px] border-[4px] border-[#8f6242] bg-[#f2d7b7]" />
        <div className="absolute left-[16px] top-[62px] h-[86px] w-10 rounded-[18px] border-[4px] border-[#8f6242] bg-[#d2a57d]" />
        <div className="absolute right-[16px] top-[62px] h-[86px] w-10 rounded-[18px] border-[4px] border-[#8f6242] bg-[#d2a57d]" />
        <div className="absolute left-[92px] top-[58px] h-[54px] w-[82px] rounded-[24px] border-[3px] border-[#8f6242] bg-[#fff3dc]" />
        <div className="absolute right-[92px] top-[54px] h-[62px] w-[90px] rounded-[28px] border-[3px] border-[#8f6242] bg-[#d9c6a3]" />
      </div>

      <div className="absolute bottom-[34px] left-1/2 h-[118px] w-[300px] -translate-x-1/2">
        <div className="absolute inset-0 rounded-[999px] bg-[#d65f4a]/20 blur-xl" />
        <div className="absolute left-1/2 top-[26px] h-[48px] w-[230px] -translate-x-1/2 rounded-[999px] border-[4px] border-[#996942] bg-[#f0d6b5]" />
        <div className="absolute left-[46px] top-[64px] h-[32px] w-[12px] rounded-full bg-[#8f6242]" />
        <div className="absolute right-[46px] top-[64px] h-[32px] w-[12px] rounded-full bg-[#8f6242]" />
        <div className="absolute left-[95px] top-[18px] h-6 w-6 rounded-full bg-[#d77d5b]" />
        <div className="absolute left-[128px] top-[14px] h-[22px] w-8 rounded-full bg-[#e4b753]" />
        <div className="absolute left-[165px] top-[16px] h-7 w-10 rounded-b-[14px] rounded-t-[10px] border-[3px] border-[#8f6242] bg-[#fff8ef]" />
        <div className="absolute left-[188px] top-[19px] h-3 w-3 rounded-full bg-[#88a876]" />
      </div>

      <div className="absolute bottom-[34px] right-[6%] h-[140px] w-[110px]">
        <div className="absolute bottom-0 left-[18px] h-12 w-[72px] rounded-[18px] border-[4px] border-[#8f6242] bg-[#d0a178]" />
        <div className="absolute bottom-[34px] left-[28px] h-[62px] w-12 rounded-full bg-[#8bb183]" />
        <div className="absolute bottom-[70px] left-[2px] h-12 w-12 rounded-full bg-[#6f986e]" />
        <div className="absolute bottom-[78px] left-[44px] h-14 w-14 rounded-full bg-[#8cb67f]" />
        <div className="absolute bottom-[50px] left-[58px] h-12 w-12 rounded-full bg-[#9bc18d]" />
      </div>
    </section>
  );
}

function CenterDecorMobile() {
  return (
    <section className="relative mt-2 h-[240px] overflow-hidden rounded-[30px] border-[3px] border-[#9b6d44] bg-[#efd7ba] md:hidden">
      {/* 装饰家具 */}
      <div className="absolute inset-x-[6%] bottom-5 h-6 rounded-full bg-[#b98052]/20 blur-lg" />
      <div className="absolute left-1/2 top-[28px] h-[132px] w-[260px] -translate-x-1/2">
        <div className="absolute left-0 top-[40px] h-[92px] w-[260px] rounded-[40px] border-[4px] border-[#8f6242] bg-[#e5bf9d]" />
        <div className="absolute left-[18px] top-[20px] h-[64px] w-[224px] rounded-[30px] border-[4px] border-[#8f6242] bg-[#f2d7b7]" />
        <div className="absolute left-[58px] top-[44px] h-10 w-[52px] rounded-[18px] border-[3px] border-[#8f6242] bg-[#fff3dc]" />
        <div className="absolute right-[50px] top-[40px] h-12 w-[62px] rounded-[20px] border-[3px] border-[#8f6242] bg-[#d9c6a3]" />
      </div>
      <div className="absolute left-1/2 top-[150px] h-[70px] w-[180px] -translate-x-1/2">
        <div className="absolute left-1/2 top-0 h-[26px] w-[150px] -translate-x-1/2 rounded-[999px] border-[4px] border-[#996942] bg-[#f0d6b5]" />
        <div className="absolute left-[28px] top-[22px] h-[24px] w-[10px] rounded-full bg-[#8f6242]" />
        <div className="absolute right-[28px] top-[22px] h-[24px] w-[10px] rounded-full bg-[#8f6242]" />
        <div className="absolute left-[58px] top-[-8px] h-5 w-5 rounded-full bg-[#d77d5b]" />
        <div className="absolute left-[88px] top-[-10px] h-4 w-7 rounded-full bg-[#e4b753]" />
      </div>
      <div className="absolute right-5 top-[58px] h-[112px] w-[88px]">
        <div className="absolute bottom-0 left-[12px] h-10 w-[58px] rounded-[16px] border-[4px] border-[#8f6242] bg-[#d0a178]" />
        <div className="absolute bottom-[26px] left-[18px] h-[48px] w-10 rounded-full bg-[#8bb183]" />
        <div className="absolute bottom-[52px] left-0 h-10 w-10 rounded-full bg-[#6f986e]" />
        <div className="absolute bottom-[58px] left-[32px] h-12 w-12 rounded-full bg-[#8cb67f]" />
      </div>
    </section>
  );
}

export default function LivingRoomHome({
  className = "",
  onNavigate,
}: LivingRoomHomeProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCoffeeOpen, setIsCoffeeOpen] = useState(false);

  const jump = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
      return;
    }

    if (typeof window !== "undefined") {
      window.location.href = path;
    }
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
      return;
    }

    jump("/");
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncPlaying = () => setIsPlaying(!audio.paused);
    const syncPause = () => setIsPlaying(false);

    audio.addEventListener("play", syncPlaying);
    audio.addEventListener("pause", syncPause);
    audio.addEventListener("ended", syncPause);

    return () => {
      audio.removeEventListener("play", syncPlaying);
      audio.removeEventListener("pause", syncPause);
      audio.removeEventListener("ended", syncPause);
    };
  }, []);

  return (
    <div
      className={`min-h-screen overflow-hidden bg-[#f6ecdd] px-4 py-6 text-[#5f4128] md:px-8 lg:px-10 ${className}`}
      style={{
        fontFamily:
          '"Hiragino Sans GB", "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif',
      }}
    >
      <style>
        {`
          @keyframes recordSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes noteSway {
            0% { transform: rotate(-1.5deg) translateY(0); }
            50% { transform: rotate(1.5deg) translateY(-2px); }
            100% { transform: rotate(-1.5deg) translateY(0); }
          }

          @keyframes lampGlow {
            0% { opacity: 0.55; }
            50% { opacity: 0.82; }
            100% { opacity: 0.55; }
          }

          .paint-noise {
            background-image:
              radial-gradient(rgba(139, 94, 60, 0.08) 0.8px, transparent 0.8px),
              linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0));
            background-size: 16px 16px, 100% 100%;
          }

          .wood-grain {
            background-image:
              linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0)),
              repeating-linear-gradient(
                90deg,
                rgba(139, 94, 60, 0.05) 0 7px,
                rgba(255,255,255,0.08) 7px 14px
              );
          }

          .message-note:hover {
            animation: noteSway 1.8s ease-in-out infinite;
          }

          .record-spinning {
            animation: recordSpin 5.4s linear infinite;
          }

          .lamp-glow {
            animation: lampGlow 3.2s ease-in-out infinite;
          }

          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      <audio ref={audioRef} src="/audio/home.mp3" preload="none" />

      <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-6">
        <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between rounded-[28px] border-[3px] border-[#b98759] bg-[#fff8ed]/95 px-4 py-3 shadow-[0_10px_30px_rgba(139,94,60,0.12)] backdrop-blur md:px-6">
          <button
            type="button"
            onClick={handleBack}
            aria-label="返回上一页"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#c89b70] bg-[#fffaf2] text-[#8b5e3c] transition hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_8px_20px_rgba(139,94,60,0.16)]"
          >
            <ArrowLeftIcon />
          </button>

          <nav className="hide-scrollbar mx-3 flex flex-1 items-center justify-start gap-2 overflow-x-auto px-1 md:justify-center lg:gap-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => jump(item.path)}
                className="shrink-0 cursor-pointer rounded-full border border-[#ead1b2] bg-[#fffaf0]/80 px-4 py-2 text-sm font-medium text-[#7b5435] transition hover:-translate-y-0.5 hover:scale-[1.03] hover:border-[#c89b70] hover:bg-[#fff5e4]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => jump("/letters")}
            aria-label="打开来信"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#c89b70] bg-[#fffaf2] text-[#8b5e3c] transition hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_8px_20px_rgba(139,94,60,0.16)]"
          >
            <MailIcon />
          </button>
        </header>

        <main className="mx-auto w-full max-w-[1280px]">
          <section className="relative overflow-hidden rounded-[36px] border-[4px] border-[#a97749] bg-[#fff8ef] p-3 shadow-[0_24px_60px_rgba(109,74,42,0.12)] md:p-5">
            <div className="paint-noise relative min-h-[760px] overflow-hidden rounded-[28px] border-[3px] border-[#c69a6d] bg-[#f8efdf] md:min-h-[840px] lg:min-h-[900px]">
              <div className="absolute inset-x-0 top-0 h-[68%] bg-gradient-to-b from-[#f7eedc] via-[#f3e3cc] to-[#ecd2af]" />
              <div className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-b from-[#d9b48a] via-[#cd9f72] to-[#bb8758]" />
              <div className="absolute left-[10%] top-10 h-40 w-40 rounded-full bg-[#fff4d5]/70 blur-2xl md:h-52 md:w-52" />
              <div className="absolute right-[11%] top-[16%] h-28 w-48 rounded-full bg-[#ffefc5]/70 blur-2xl md:h-36 md:w-60" />
              <div className="absolute inset-x-[6%] bottom-[28%] h-[3px] rounded-full bg-[#9e734f]/50" />

              <div className="relative z-10 mx-auto max-w-[1180px] px-4 pb-10 pt-6 md:px-6 md:pt-8">
                <div className="flex flex-col gap-4 md:hidden">
                  <WallShelf books={books} records={records} onJump={jump} />
                  <PostcardWall onJump={jump} />
                  <div className="ml-auto">
                    <MessageBoard />
                  </div>
                  <div className="max-w-[360px]">
                    <MusicPlayer isPlaying={isPlaying} onToggle={toggleMusic} />
                  </div>
                  <div className="ml-auto max-w-[350px]">
                    <CoffeeCorner onOpen={() => setIsCoffeeOpen(true)} />
                  </div>
                  <CenterDecorMobile />
                </div>

                <div className="hidden md:grid md:min-h-[780px] md:grid-cols-[360px_minmax(340px,1fr)_340px] md:gap-x-8">
                  <div className="flex min-h-[780px] flex-col gap-6">
                    <WallShelf books={books} records={records} onJump={jump} />
                    <div className="mt-auto">
                      <MusicPlayer isPlaying={isPlaying} onToggle={toggleMusic} />
                    </div>
                  </div>

                  <div className="relative min-h-[780px]">
                    <CenterDecorDesktop />
                  </div>

                  <div className="flex min-h-[780px] flex-col gap-6">
                    <PostcardWall onJump={jump} />
                    <MessageBoard />
                    <div className="mt-auto">
                      <CoffeeCorner onOpen={() => setIsCoffeeOpen(true)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {isCoffeeOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#6c4a30]/30 px-4 py-8 backdrop-blur-sm"
          onClick={() => setIsCoffeeOpen(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-[560px] rounded-[32px] border-[3px] border-[#ba8d63] bg-[#fffaf1] p-6 shadow-[0_24px_60px_rgba(109,74,42,0.20)] md:p-7"
            role="dialog"
            aria-modal="true"
            aria-labelledby="coffee-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#bf8a58]">Coffee Notes</p>
                <h2
                  id="coffee-modal-title"
                  className="mt-2 text-2xl font-semibold text-[#744c2f]"
                >
                  最近的自制咖啡
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCoffeeOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#d2ab82] bg-[#fff5e9] text-xl leading-none text-[#8b5e3c] transition hover:scale-105 hover:bg-[#fff0dc]"
                aria-label="关闭咖啡弹窗"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {coffeeEntries.map((entry) => (
                <article
                  key={entry.name}
                  className="rounded-[22px] border-[2px] border-[#ead0b0] bg-[#fffdf8] px-4 py-4 shadow-[0_10px_20px_rgba(109,74,42,0.06)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-[#7b5132]">{entry.name}</h3>
                    <span className="rounded-full bg-[#f8ecdc] px-3 py-1 text-xs text-[#9b6d44]">
                      {entry.mood}
                    </span>
                  </div>
                  <p className="mt-1 text-xs tracking-[0.18em] text-[#bd8b5b]">{entry.date}</p>
                  <p className="mt-3 text-sm leading-7 text-[#765236]">{entry.note}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
