/** @type {import('tailwindcss').Config} */
module.exports = {
  // ここに適用対象のファイルを指定
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class", // NativeWindのダークモード対応を有効化
  theme: {
    extend: {},
  },
  plugins: [],
};
