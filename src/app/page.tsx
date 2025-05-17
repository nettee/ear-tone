import { ChordPlayer } from "@/components/ChordPlayer";
import { Ear } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col h-screen">
            <header className="flex flex-col">
                <div className="mx-6 my-3">
                    <div className="flex items-center gap-2">
                        <Ear className="w-6 h-6" />
                        <h1 className="text-2xl font-bold">和弦分层练习</h1>
                    </div>
                </div>
                <div className="h-px bg-gray-200 w-full"></div>
            </header>
            <main className="flex-1 flex flex-col">
                {/* 练习方法说明 */}
                <section className="w-full">
                    <div className="m-2 p-4 bg-gray-100 rounded-md">
                        <h2>练习方法：</h2>
                        <ol className="list-decimal list-inside">
                            <li>点击播放按钮，听和弦</li>
                            <li>自己在键盘上尝试找出和弦</li>
                            <li>点击答案按钮，查看答案并对比</li>
                        </ol>
                    </div>
                </section>
                {/* 交互式练习部分 */}
                <section className="flex-1">
                    <ChordPlayer />
                </section>
            </main>
        </div>
    );
}
