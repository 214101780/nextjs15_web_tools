import type { Metadata } from "next";

// SEO配置
export const metadata: Metadata = {
  title: "文本拼接工具 - 在线多行文本拼接转换器",
  description: "专业的在线文本拼接工具，支持自定义分隔符、前缀和后缀设置。快速将多行文本拼接成单行格式，适用于SQL语句、数组格式化、CSV数据处理等多种场景。",
  keywords: "文本拼接,多行文本拼接,文本转换器,分隔符拼接,SQL拼接,数组格式化,CSV处理,在线工具",
};

export default function TextJoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}