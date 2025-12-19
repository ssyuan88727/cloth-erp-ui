// app/composables/useValidateRules.ts
export default () => {
  return {
    // 必填：嚴格檢查空字串、null、undefined
    required: (v: any) =>
      (v !== null && v !== undefined && String(v).trim() !== "") ||
      "此欄位為必填。",

    // 長度校驗：增加空值保護
    minLength: (min: number) => (v: string) =>
      !v || v.length >= min || `至少需要 ${min} 個字`,

    maxLength: (max: number) => (v: string) =>
      !v || v.length <= max || `最多只能輸入 ${max} 個字`,

    // 數字：強化判斷邏輯
    isNumber: (v: any) => {
      if (v === null || v === undefined || v === "") return true;
      return (!isNaN(parseFloat(v)) && isFinite(Number(v))) || "僅能輸入數字";
    },

    // 英數：優化正則
    isAlphaNumeric: (v: string) => {
      if (!v) return true;
      return /^[a-zA-Z0-9]*$/.test(v) || "僅能輸入英數";
    },

    // 電子郵件
    isEmail: (v: string) => {
      if (!v) return true;
      const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return pattern.test(v) || "不符合電子郵件格式";
    },
  };
};
