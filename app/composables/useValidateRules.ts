export default () => {
  return {
    // 必填
    required: (value: string | number | null | undefined) =>
      (value !== null && value !== undefined && value !== "") ||
      "此欄位為必填。",
    // 最小長度
    minLength: (min: number) => (v: string) =>
      v.length >= min || `至少需要 ${min} 個字`,
    // 最大長度
    maxLength: (max: number) => (v: string) =>
      v.length <= max || `最多只能輸入 ${max} 個字`,
    // 數字
    isNumber: (v: string) =>
      (!isNaN(parseFloat(v)) && isFinite(Number(v))) || "僅能輸入數字",
    // 英數
    isAlphaNumeric: (v: string) => /^[a-zA-Z0-9]+$/.test(v) || "僅能輸入英數",
    // 電子郵件
    isEmail: (v: string) =>
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        v
      ) || "不符合電子郵件格式",
  };
};
