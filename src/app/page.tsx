import { ChordPlayer } from "@/components/ChordPlayer";
import { Ear } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-col">
                <div className="mx-6 my-4">
                    <div className="flex items-center gap-2">
                        <Ear className="w-6 h-6" />
                        <h1 className="text-2xl font-bold">和弦分层练习</h1>
                    </div>
                </div>
                <div className="h-px bg-gray-200 w-full"></div>
            </div>
            <div className="w-full">
                <div className="m-2 p-4 bg-gray-100 rounded-md">
                    <p>练习方法：</p>
                    <p>1. 点击播放按钮，听和弦</p>
                    <p>2. 自己在键盘上尝试找出和弦</p>
                    <p>3. 点击答案按钮，查看答案并对比</p>
                </div>
            </div>
            <div className="flex-1">
                <ChordPlayer />
            </div>
        </div>
    );
}
