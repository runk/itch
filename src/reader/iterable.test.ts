import fs from 'fs';
import createIterator from './iterable';

let reader: IterableIterator<Buffer>;
let fd: number;

beforeEach(() => {
  fd = fs.openSync('/Users/dshirokov/Downloads/01302020.NASDAQ_ITCH50', 'r');
  reader = createIterator(fd);
})
afterEach((done) => fs.close(fd, done));

const expected = [
  "530000000009f649c80cd34f",
  "52000100000a37d4c8050b41202020202020204e20000000644e435a20504e20314e000000004e",
  "52000200000a37d4c9da8741412020202020204e20000000644e435a20504e20314e000000014e",
  "52000300000a37d4caa03541414155202020205020000000644e514920504e203259000000014e",
  "52000400000a37d4cb54fc4141434720202020474e000000644e415a20504e4e324e000000004e",
  "52000500000a37d4cbf36241414452202020205020000000644e514920504e203259000000004e",
  "52000600000a37d4cc8e0141414c2020202020514e000000644e435a20504e4e314e000000004e",
  "52000700000a37d4cd2c5941414d43202020204120000000644e435a20504e20324e000000004e",
  "52000800000a37d4cdc4a141414d4520202020474e000000644e435a20504e4e324e000000004e",
  "52000900000a37d4ce5a7d41414e20202020204e20000000644e435a20504e20324e000000004e",
  "52000a00000a37d4cef2cf41414f4920202020474e000000644e435a20504e4e324e000000004e",
  "52000b00000a37d4cf8c0041414f4e20202020514e000000644e435a20504e4e324e000000004e",
  "52000c00000a37d4d03a4341415020202020204e20000000644e435a20504e20314e000000004e",
  "52000d00000a37d4d0d3094141504c20202020514e000000644e435a20504e4e314e000000004e",
  "52000e00000a37d4d168b941415420202020204e20000000644e435254504e20324e000000004e",
  "52000f00000a37d4d2320e41415520202020204120000000644e435a20504e20324e000000004e",
  "52001000000a37d4d2d7274141575720202020514e000000644e435a20504e4e324e000000004e",
  "52001100000a37d4d373a74141584a20202020474e000000644e514920504e4e3159000000014e",
  "52001200000a37d4d417944141584e20202020514e000000644e435a20504e4e324e000000004e",
  "52001300000a37d4d4b16d41422020202020204e20000000644e4c5a20504e20324e000000004e",
  "52001400000a37d4d549f341424220202020204e20000000644e415a20504e20324e000000004e",
  "52001500000a37d4d5e53841424256202020204e20000000644e435a20504e20314e000000004e",
  "52001600000a37d4d684a341424320202020204e20000000644e435a20504e20314e000000004e",
  "52001700000a37d4d71c754142434220202020514e000000644e435a20504e4e324e000000004e",
  "52001800000a37d4d7b50941424443202020205144000000644e435120504e4e324e000000004e",
  "52001900000a37d4d850084142454f20202020534e000000644e435a20504e4e324e000000004e",
  "52001a00000a37d4d8e84c41424551202020205020000000644e514920504e203259000000014e",
  "52001b00000a37d4d97ec541424556202020204e20000000644e415a20504e20324e000000004e",
  "52001c00000a37d4da139441424720202020204e20000000644e435a20504e20324e000000004e",
  "52001d00000a37d4daac0a4142494f20202020534e000000644e435a20504e4e324e000000004e",
  "52001e00000a37d4db432041424d20202020204e20000000644e435a20504e20324e000000004e",
  "52001f00000a37d4dbdde941424d4420202020514e000000644e435a20504e4e314e000000004e",
  "52002000000a37d4dc872c41425220202020204e20000000644e435254504e20324e000000004e",
  "52002100000a37d4dd21074142522d412020204e20000000644e505a20504e20324e000000004e",
  "52002200000a37d4ddba5c4142522d422020204e20000000644e505a20504e20324e000000004e",
  "52002300000a37d4de530c4142522d432020204e20000000644e505a20504e20324e000000004e",
  "52002400000a37d4def29941425420202020204e20000000644e435a20504e20314e000000004e",
  "52002500000a37d4df928a4142545820202020474e000000644e435a20504e4e324e000000014e",
  "52002600000a37d4e02bc84142555320202020514e000000644e435a20504e4e324e000000004e",
  "52002700000a37d4e0c33841432020202020204e20000000644e435a20504e20324e000000004e",
  "52002800000a37d4e15ce541434120202020204e20000000644e435a20504e20324e000000014e",
  "52002900000a37d4e1fe2f4143414420202020514e000000644e435a20504e4e324e000000004e",
  "52002a00000a37d4e2976b4143414d20202020534e000000644e435a20504e4e324e000000014e",
  "52002b00000a37d4e337954143414d55202020534e000000644e555a20504e4e324e000000014e",
  "52002c00000a37d4e3d50d4143414d57202020534e000000644e575a20504e4e204e000000014e",
  "52002d00000a37d4e46e2641434220202020204e20000000644e435a20504e20324e000000014e",
  "52002e00000a37d4e505ff4143424920202020514e000000644e435a20504e4e324e000000004e",
  "52002f00000a37d4e5a3cc41434320202020204e20000000644e435254504e20314e000000004e",
  "52003000000a37d4e643784143434f202020204e20000000644e435a20504e20324e000000004e",
  "52003100000a37d4e6da944143454c202020204e20000000644e435a20504e20324e000000014e",
  "52003200000a37d4e790aa4143454c2b2020204e20000000644e575a20504e20204e000000014e",
]

test('supports `for .. of` syntax', () => {
  let i = 0;
  const msgs = [];
  for (let msg of reader) {
    const type = String.fromCharCode(msg[0]);
    // system & stock directory messages
    expect(['S', 'R']).toContain(type)
    msgs.push(msg.toString('hex'));

    if (i++ >= 50) {
      break;
    }
  }
  expect(msgs).toEqual(expected)
})

test('supports `next()` iteration style', () => {
  const msgs = [];
  for (let i = 0; i <= 50; i++) {
    const msg = reader.next();
    const type = String.fromCharCode(msg.value[0]);
    // system & stock directory messages
    expect(['S', 'R']).toContain(type);
    expect(msg.done).toBe(false);
    msgs.push(msg.value.toString('hex'));
  }
  expect(msgs).toEqual(expected)
})
