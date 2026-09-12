import { useState } from "react";
import { IconComment, IconEye, IconLinkedin, IconThumbsUp, IconUsers } from "./icons";
import type { MarketplaceCreator } from "../lib/types";

function initials(name: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatNumber(n: number | null) {
  if (n === null || n === undefined) return "—";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
}

export function MarketplaceCard({ creator }: { creator: MarketplaceCreator }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="[perspective:1500px] w-full max-w-sm h-[560px]">
      <div
        className={`relative h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front face */}
        <div className="absolute inset-0 [backface-visibility:hidden] bg-white rounded-card shadow-lg overflow-y-auto border border-gray-100">
          <div className="h-20 bg-gradient-to-r from-naano-blue to-indigo-500 relative">
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 text-naano-blue text-xs font-medium px-2 py-1 rounded-full">
              <IconLinkedin />
              <span>LinkedIn</span>
            </div>
            {creator.countryFlag && (
              <div className="absolute top-3 right-3 text-lg">{creator.countryFlag}</div>
            )}
          </div>
          <div className="px-5 -mt-10 pb-5">
            <div className="w-20 h-20 rounded-full ring-4 ring-white bg-naano-dark text-white flex items-center justify-center text-xl font-semibold overflow-hidden">
              {creator.photoUrl ? (
                <img src={creator.photoUrl} alt={creator.fullName ?? ""} className="w-full h-full object-cover" />
              ) : (
                initials(creator.fullName)
              )}
            </div>
            <h3 className="mt-3 text-lg font-semibold text-naano-dark">{creator.fullName ?? "Unnamed creator"}</h3>
            {creator.headline && <p className="text-sm text-gray-500 mt-0.5">{creator.headline}</p>}

            {creator.industries.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {creator.industries.map((ind) => (
                  <span key={ind} className="text-xs bg-naano-blue/10 text-naano-blue px-2 py-0.5 rounded-full font-medium">
                    {ind}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-gray-100 text-center">
              <div>
                <div className="flex justify-center text-gray-400"><IconUsers /></div>
                <div className="text-sm font-semibold text-naano-dark mt-1">{formatNumber(creator.followers)}</div>
                <div className="text-[10px] text-gray-400">Followers</div>
              </div>
              <div>
                <div className="flex justify-center text-gray-400"><IconThumbsUp /></div>
                <div className="text-sm font-semibold text-naano-dark mt-1">{formatNumber(creator.reactionsPerPost)}</div>
                <div className="text-[10px] text-gray-400">Reactions</div>
              </div>
              <div>
                <div className="flex justify-center text-gray-400"><IconEye /></div>
                <div className="text-sm font-semibold text-naano-dark mt-1">{formatNumber(creator.impressionsPerPost)}</div>
                <div className="text-[10px] text-gray-400">Impressions</div>
              </div>
              <div>
                <div className="flex justify-center text-gray-400"><IconComment /></div>
                <div className="text-sm font-semibold text-naano-dark mt-1">{formatNumber(creator.commentsPerPost)}</div>
                <div className="text-[10px] text-gray-400">Comments</div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div>
                <div className="text-lg font-bold text-naano-dark">
                  {creator.pricePerPost ? `€${creator.pricePerPost}` : "—"}
                  <span className="text-xs font-normal text-gray-400"> /post</span>
                </div>
              </div>
              <button
                onClick={() => setFlipped(true)}
                className="text-sm font-medium text-naano-blue hover:underline"
              >
                View performance →
              </button>
            </div>
          </div>
        </div>

        {/* Back face */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white rounded-card shadow-lg overflow-hidden border border-gray-100 flex flex-col">
          <div className="px-5 pt-5 pb-4 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-naano-dark">Performance &amp; ICP</h4>
              <button onClick={() => setFlipped(false)} className="text-gray-400 hover:text-gray-600 text-sm">
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Public LinkedIn profile data from Apify (Basic card)
            </p>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-sm font-semibold text-naano-dark">{formatNumber(creator.followers)}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Followers</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-sm font-semibold text-naano-dark">{formatNumber(creator.reactionsPerPost)}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Reactions / post</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-sm font-semibold text-naano-dark">{formatNumber(creator.impressionsPerPost)}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Impressions / post</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-sm font-semibold text-naano-dark">{formatNumber(creator.commentsPerPost)}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Comments / post</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-sm font-semibold text-naano-dark">
                  {creator.engagementRate !== null ? `${creator.engagementRate}%` : "—"}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">Engagement rate</div>
              </div>
            </div>

            {creator.bio && (
              <div className="mt-4">
                <div className="text-xs font-semibold text-naano-dark mb-1">About</div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-5">{creator.bio}</p>
              </div>
            )}

            {creator.industries.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-semibold text-naano-dark mb-1.5">Who you target (est.)</div>
                <div className="space-y-1.5">
                  {creator.industries.map((ind, i) => {
                    const pct = Math.max(10, 45 - i * 15);
                    return (
                      <div key={ind}>
                        <div className="flex justify-between text-[11px] text-gray-500 mb-0.5">
                          <span>{ind}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-naano-blue rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  {creator.country && (
                    <div className="flex justify-between text-[11px] text-gray-500 pt-1">
                      <span>{creator.countryFlag} {creator.country}</span>
                      <span>primary market</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-100">
            <button className="w-full bg-naano-dark text-white text-sm font-medium py-2.5 rounded-xl hover:bg-naano-dark/90">
              View profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
