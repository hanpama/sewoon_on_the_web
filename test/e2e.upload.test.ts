import * as path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

import { appReady } from '../src/server';
import { APP_PORT, HOST } from '../src/environment';


const execPromise = promisify(exec);
jest.setTimeout(20000);
const fixturePath = path.join(__dirname, 'fixture.kmz');
const host = `${HOST}:${APP_PORT}`;


describe('server', () => {
  let server: any;
  beforeAll(() => appReady.then(s => { server = s; }));
  afterAll(() => server.close());

  it('should let us upload kmz file', async () => {

    const uploadCmd = `curl -XPUT -F "kmzfile=@${fixturePath}" ${host}/importKmz`;
    // console.log(uploadCmd)

    const uploadResponse = await execPromise(uploadCmd);
    // console.log(uploadResponse.stdout.toString());

    const uploadResult = JSON.parse(uploadResponse.stdout);
    expect(uploadResult.errors).toBeUndefined();
    expect(typeof uploadResult.data.importKmz.id).toBe('string');
    // console.log(uploadResponse);

    const czmlQueryCmd = `curl -XGET ${host}/czml/${uploadResult.data.importKmz.id}`;
    // console.log(czmlQueryCmd);
    const czmlQueryResponse = await execPromise(czmlQueryCmd);
    // console.log(czmlQueryResponse.stdout.toString());

    const czmlQueryData = JSON.parse(czmlQueryResponse.stdout);
    expect(czmlQueryData).toHaveLength(2);

    // 반환되는 패킷에는 모델이 포함되어 있습니다.
    // 패킷 중에 모델 필드가 있는 항목에서 링크를 읽어 그 주소로 요청을 보내면
    // gltf 데이터를 다시 가져올 수 있습니다.
    const linkNode = czmlQueryData.find((i: any) => i.model);
    const gltfUri = linkNode.model.gltf;

    // gltf 데이터는 절대 경로로 표현되어야 합니다.
    // 이거 czml 스펙에는 없지만 유연하게 사용하기 위해서는 필요.
    expect(gltfUri).toMatch(new RegExp(`^${host}`));

    await execPromise(
      `curl -XGET ${gltfUri}`
    );
  });
});
