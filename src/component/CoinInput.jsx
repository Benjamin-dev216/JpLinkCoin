import React, { useState } from "react";

const CoinIcon = ({ type, polValue, jplinkValue }) => {
  return (
    <div>
      <div className="font-bold text-white text-2xl">
        {
          type === "polygon" ?
            <div className="flex leading-normal"><img
              src="/image/polygon.png"
              alt=""
              className="w-10 h-10 mr-2"
            />Pol</div> :
            <div className="flex leading-normal">
              <img
                src="/image/jplinkcoin.png"
                alt=""
                className="w-10 h-10 mr-2"
              />
              JpLink
            </div>
        }
      </div>
      <div className="text-lg text-right">
        {type === "polygon" ? polValue : jplinkValue}
      </div>
    </div>
  )
}

export default function CoinInput({
  billingType,
  coinType,
  disabled,
  value,
  onChangeValue,
  className,
  polValue,
  jplinkValue
}) {
  return (
    <>
      {disabled ? (
        <div className={className}>
          <div className="basis-0 flex-col w-full text-white bg-[#050c19] p-5 rounded-3xl border-[#0d1018] border-2">
            <div className="text-base text-left px-2 font-bold">
              {billingType}
            </div>
            <div className="my-2">
              <div className="bg-[#050c19] flex h-14 items-center rounded-md pl-3">
                <input
                  onChange={(e) => onChangeValue(e.target.value)}
                  type="number"
                  placeholder="0"
                  value={value ? value : ""}
                  className="block bg-[#050c19] min-w-0 grow py-1.5 pr-3 text-white placeholder:text-white focus:outline-none text-4xl "
                />
                <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                  <div className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-white placeholder:text-white focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 text-4xl">
                    {coinType === "Polygon" ? <CoinIcon type="polygon" polValue={polValue} jplinkValue={jplinkValue} /> : <CoinIcon type="jplink" polValue={polValue} jplinkValue={jplinkValue} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="basis-0 flex-col w-full text-white bg-[#050c21] p-5 rounded-3xl border-[#0d1018] border-2">
          <div className="text-base text-left px-2 font-bold">
            {billingType}
          </div>
          <div className="my-2">
            <div className="bg-[#050c21] flex h-14 items-center rounded-md pl-3">
              <input
                onChange={(e) => onChangeValue(e.target.value)}
                type="number"
                placeholder="0"
                value={value ? value : ""}
                className="block bg-[#050c21] min-w-0 grow py-1.5 pr-3 text-white placeholder:text-white focus:outline-none text-4xl "
              />
              <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                <div className="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-white placeholder:text-white focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 text-4xl">
                  {coinType === "Polygon" ? <CoinIcon type="polygon" polValue={polValue} jplinkValue={jplinkValue} /> : <CoinIcon type="jplink" polValue={polValue} jplinkValue={jplinkValue} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
//outline-1 -outline-offset-1 outline-white has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600"
