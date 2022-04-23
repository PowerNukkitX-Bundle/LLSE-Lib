export class File {
	constroctor(path, mode, isBinary = false){
		/*
		参数：
			path : String
			想要打开的文件路径
			mode : Enum
			文件的打开模式
			isBinary : Boolean
			（可选参数）是否以二进制模式打开文件，默认为 false
		普通模式下，文件读写过程中，换行符将会被按本地格式转换。如果你使用二进制模式打开文件，表明此文件并非普通的文本格式，这些自动转换将不会发生。
		返回值：打开的文件对象
		返回值类型：File
		如果打开失败，将抛出异常
		*/
	}
	static readFrom(path) {
		/*
		参数：
			path : String
			目标文件的路径，相对路径以 BDS 根目录为基准
		返回值：文件的所有数据
		返回值类型：String
		如返回值为 Null 则表示读取失败
		*/
		return null;
	}
	static writeTo(path, text) {
		/*
		参数：
			path : String
			目标文件的路径，相对路径以 BDS 根目录为基准
			text : String
			要写入的内容
		返回值：是否写入成功
		返回值类型：Boolean
		*/
		return false;
	}
	static writeLine(path, text) {
		/*
		参数：
			path : String
			目标文件的路径，相对路径以 BDS 根目录为基准
			text : String
			要写入的内容
		返回值：是否写入成功
		返回值类型：Boolean
		*/
		return false;
	}
	readSync(cnt) {
		/*
		参数：
			cnt : Number
			要读取的字符数 / 字节数
		返回值：读取的字符串内容 / 二进制数据
		返回值类型：String / ByteBuffer
		如返回值为 Null 则表示读取失败
		*/
		return null;
	}
	readLineSync() {
		/*
		返回值：读取的字符串内容
		返回值类型：String
		如返回值为 Null 则表示读取失败
		注意，字符串尾部的换行符要自行处理
		*/
		return null;
	}
	readAllSync() {
		/*
		返回值：读取的字符串内容 / 二进制数据
		返回值类型：String / ByteBuffer
		如返回值为 Null 则表示读取失败
		*/
		return null;
	}
	writeSync(str) {
		/*
		参数：
			str : String / ByteBuffer
			要写入的内容
		返回值：是否成功写入
		返回值类型：Boolean
		*/
		return false;
	}
	writeLineSync(str) {
		/*
		参数：
			str : String
			要写入的内容
		返回值：是否成功写入
		返回值类型：Boolean
		此函数执行时，将在字符串尾自动添加换行符
		*/
		return false;
	}
	async read(cnt, callback) {
		/*
		参数：
			cnt : Number
			要读取的字符数 / 字节数
			callback : Function
			获取结果的回调函数
		返回值：是否成功发送请求
		返回值类型：Boolean
		注：参数 callback 的回调函数原型：function(result)
			result : String / ByteBuffer
			读取到的文本 / 二进制数据
		如 result 为 Null 则表示读取失败
		从当前文件指针处开始读取。如果文件以二进制模式打开，则返回 ByteBuffer，否则返回 String
		*/
		return callback(null);
	}
	async readLine(callback) {
		/*
		参数：
			callback : Function
			获取结果的回调函数
		返回值：是否成功发送请求
		返回值类型：Boolean
		注：参数 callback 的回调函数原型：function(result)
			result : String
			读取到的文本
		注意，字符串尾部的换行符要自行处理
		*/
		return callback('');
	}
	async readAll(callback) {
		/*
		参数：
		callback : Function
		获取结果的回调函数
		返回值：是否成功发送请求
		返回值类型：Boolean
		注：参数 callback 的回调函数原型：function(result)

		result : String / ByteBuffer
		读取到的文本 / 二进制数据
		如 result 为 Null 则表示读取失败
		*/
		return callback(null);
	}
	async write(str, callback) {
		/*
		参数：
			str : String / ByteBuffer
			要写入的内容
			callback : Function
			（可选参数）获取结果的回调函数
		返回值：是否成功发送请求
		返回值类型：Boolean
		如果文件以二进制模式打开，请传入一个 ByteBuffer，否则需要传入 String
		注：参数 callback 的回调函数原型：function(result)
			result : Boolean
			是否写入成功
		*/
		if (callback) {
			callback(false);
		}
	}
	async writeLine(str, callback) {
		/*
		参数：
			str : String
			要写入的内容
			callback : Function
			（可选参数）获取结果的回调函数
		返回值：是否成功发送请求
		返回值类型：Boolean
		注：参数 callback 的回调函数原型：function(result)
			result : Boolean
			是否写入成功
		此函数执行时，将在字符串尾自动添加换行符
		*/
		if (callback) {
			callback(false);
		}
	}
}