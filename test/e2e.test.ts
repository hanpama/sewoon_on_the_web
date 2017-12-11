const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const { appReady } = require('../src/server');
const { APP_PORT, HOST } = require('../env');


const fixturePath = path.join(__dirname, 'fixture.kmz');

// const host = `http://localhost:${APP_PORT}`;

/**
 * E2E 테스트: kmz를 올리고 그 결과 타입들이 올바르게 서비스되는지 테스트
 *
 * 여기에는 테스트로 사용되는 kmz 파일이 필요합니다.
 * kmz파일은 모델 인스턴스가 포함되어 있어야 합니다.
 */
test('upload kmz file', async () => {
  await appReady;

  const uploadResponse = await exec(
    `curl -XPOST -F "kmzfile=@${fixturePath}" ${HOST}/kmz`
  );
  // console.log(uploadResponse.stdout.toString());
  const uploadResult = JSON.parse(uploadResponse.stdout);
  // 모델 하나밖에 안 들어 있어서 패킷이 1개 있어야 합니다.
  expect(uploadResult.models).toHaveLength(1);

  // 패키지는 패킷의 모음으로서, CZML로 서비스될 수 있습니다.
  // CZML로 서비스되는 경우 위의 패키지 도큐먼트의 packets만 반환하게 됩니다.
  const czmlQueryResponse = await exec(
    `curl -XGET ${HOST}/czml/${uploadResult.id}`,
  );
  const czmlQueryData = JSON.parse(czmlQueryResponse.stdout);
  expect(czmlQueryData).toHaveLength(1);

  // 반환되는 패킷에는 모델이 포함되어 있습니다.
  // 패킷 중에 모델 필드가 있는 항목에서 링크를 읽어 그 주소로 요청을 보내면
  // gltf 데이터를 다시 가져올 수 있습니다.
  const linkNode = czmlQueryData.find((i: any) => i.model);
  const gltfUri = linkNode.model.gltf;

  // gltf 데이터는 절대 경로로 표현되어야 합니다.
  // 이거 czml 스펙에는 없지만 유연하게 사용하기 위해서는 필요.
  expect(gltfUri).toMatch(new RegExp(`^${HOST}`));

  const gltfResponse = await exec(
    `curl -XGET ${gltfUri}`
  );
  const gltfData = JSON.parse(gltfResponse.stdout);
  expect(gltfData).toEqual(3);

});

