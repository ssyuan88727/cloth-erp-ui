export default () => {
  // 抽離出純粹的校驗邏輯，方便單元測試與複用
  return {
    required: (v: any) =>
      (v !== null && v !== undefined && v !== "") || "此欄位為必填。",

    minLength: (min: number) => (v: string) =>
      (v && v.length >= min) || `至少需要 ${min} 個字`,

    maxLength: (max: number) => (v: string) =>
      (v && v.length <= max) || `最多只能輸入 ${max} 個字`,

    isNumber: (v: string) => {
      if (!v) return true; // 允許空值，必填交給 required 判斷
      return (!isNaN(parseFloat(v)) && isFinite(Number(v))) || "僅能輸入數字";
    },

    isEmail: (v: string) => {
      if (!v) return true;
      const pattern =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return pattern.test(v) || "不符合電子郵件格式";
    },

    // 新增：組合式校驗 (可擴展)
    isAlphaNumeric: (v: string) => /^[a-zA-Z0-9]*$/.test(v) || "僅能輸入英數",
  };
};
