import reader from './reader';
import { Message } from './types';

const source = "/Users/dshirokov/Downloads/01302020.NASDAQ_ITCH50";

reader(source, (msg: Message) => {
	console.log(msg)
})
