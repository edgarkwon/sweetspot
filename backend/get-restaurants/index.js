const axios = require('axios');
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  console.log("이벤트", event);
  const authKey = '0814e4256ff5d0d6432406b7a0d3f4c7';
  console.log("메소드", event.requestContext.http.method);

  const addressCodeMapping =  {'종로구 사직동': 11110530, '종로구 삼청동': 11110540, '종로구 부암동': 11110550, '종로구 평창동': 11110560, '종로구 무악동': 11110570, '종로구 교남동': 11110580, '종로구 가회동': 11110600, '종로구 종로1.2.3.4가동': 11110615, '종로구 종로5.6가동': 11110630, '종로구 이화동': 11110640, '종로구 창신1동': 11110670, '종로구 창신2동': 11110680, '종로구 창신3동': 11110690, '종로구 숭인1동': 11110700, '종로구 숭인2동': 11110710, '종로구 청운효자동': 11110515, '종로구 혜화동': 11110650, '중구 소공동': 11140520, '중구 회현동': 11140540, '중구 명동': 11140550, '중구 필동': 11140570, '중구 장충동': 11140580, '중구 광희동': 11140590, '중구 을지로동': 11140605, '중구 신당5동': 11140650, '중구 황학동': 11140670, '중구 중림동': 11140680, '중구 신당동': 11140615, '중구 다산동': 11140625, '중구 약수동': 11140635, '중구 청구동': 11140645, '중구 동화동': 11140665, '용산구 후암동': 11170510, '용산구 용산2가동': 11170520, '용산구 남영동': 11170530, '용산구 원효로2동': 11170570, '용산구 효창동': 11170580, '용산구 용문동': 11170590, '용산구 이촌1동': 11170630, '용산구 이촌2동': 11170640, '용산구 이태원1동': 11170650, '용산구 이태원2동': 11170660, '용산구 서빙고동': 11170690, '용산구 보광동': 11170700, '용산구 청파동': 11170555, '용산구 원효로1동': 11170560, '용산구 한강로동': 11170625, '용산구 한남동': 11170685, '성동구 왕십리2동': 11200520, '성동구 마장동': 11200540, '성동구 사근동': 11200550, '성동구 행당1동': 11200560, '성동구 행당2동': 11200570, '성동구 응봉동': 11200580, '성동구 금호1가동': 11200590, '성동구 금호4가동': 11200620, '성동구 성수1가1동': 11200650, '성동구 성수1가2동': 11200660, '성동구 성수2가1동': 11200670, '성동구 성수2가3동': 11200690, '성동구 송정동': 11200720, '성동구 용답동': 11200790, '성동구 왕십리도선동': 11200535, '성동구 금호2.3가동': 11200615, '성동구 옥수동': 11200645, '광진구 화양동': 11215710, '광진구 군자동': 11215730, '광진구 중곡1동': 11215740, '광진구 중곡2동': 11215750, '광진구 중곡3동': 11215760, '광진구 중곡4동': 11215770, '광진구 능동': 11215780, '광진구 구의1동': 11215850, '광진구 구의2동': 11215860, '광진구 구의3동': 11215870, '광진구 광장동': 11215810, '광진구 자양1동': 11215820, '광진구 자양2동': 11215830, '광진구 자양3동': 11215840, '광진구 자양4동': 11215847, '동대문구 회기동': 11230710, '동대문구 휘경1동': 11230720, '동대문구 휘경2동': 11230730, '동대문구 청량리동': 11230705, '동대문구 용신동': 11230536, '동대문구 제기동': 11230545, '동대문구 전농1동': 11230560, '동대문구 전농2동': 11230570, '동대문구 답십리2동': 11230610, '동대문구 장안1동': 11230650, '동대문구 장안2동': 11230660, '동대문구 이문1동': 11230740, '동대문구 이문2동': 11230750, '동대문구 답십리1동': 11230600, '중랑구 면목2동': 11260520, '중랑구 면목4동': 11260540, '중랑구 면목5동': 11260550, '중랑구 면목7동': 11260570, '중랑구 상봉1동': 11260580, '중랑구 상봉2동': 11260590, '중랑구 중화1동': 11260600, '중랑구 중화2동': 11260610, '중랑구 묵1동': 11260620, '중랑구 묵2동': 11260630, '중랑구 망우3동': 11260660, '중랑구 신내1동': 11260680, '중랑구 신내2동': 11260690, '중랑구 면목본동': 11260565, '중랑구 면목3.8동': 11260575, '중랑구 망우본동': 11260655, '성북구 돈암1동': 11290580, '성북구 돈암2동': 11290590, '성북구 안암동': 11290600, '성북구 보문동': 11290610, '성북구 정릉1동': 11290620, '성북구 정릉2동': 11290630, '성북구 정릉3동': 11290640, '성북구 정릉4동': 11290650, '성북구 길음1동': 11290660, '성북구 길음2동': 11290685, '성북구 월곡1동': 11290715, '성북구 월곡2동': 11290725, '성북구 장위1동': 11290760, '성북구 장위2동': 11290770, '성북구 장위3동': 11290780, '성북구 성북동': 11290525, '성북구 삼선동': 11290555, '성북구 동선동': 11290575, '성북구 종암동': 11290705, '성북구 석관동': 11290810, '강북구 번1동': 11305590, '강북구 번2동': 11305600, '강북구 번3동': 11305606, '강북구 수유1동': 11305610, '강북구 수유2동': 11305620, '강북구 수유3동': 11305630, '강북구 삼양동': 11305534, '강북구 미아동': 11305535, '강북구 송중동': 11305545, '강북구 송천동': 11305555, '강북구 삼각산동': 11305575, '강북구 우이동': 11305645, '강북구 인수동': 11305660, '도봉구 쌍문1동': 11320660, '도봉구 쌍문2동': 11320670, '도봉구 쌍문3동': 11320680, '도봉구 쌍문4동': 11320681, '도봉구 방학1동': 11320690, '도봉구 방학2동': 11320700, '도봉구 방학3동': 11320710, '도봉구 창1동': 11320511, '도봉구 창2동': 11320512, '도봉구 창3동': 11320513, '도봉구 창4동': 11320514, '도봉구 창5동': 11320515, '도봉구 도봉1동': 11320521, '도봉구 도봉2동': 11320522, '노원구 월계1동': 11350560, '노원구 월계2동': 11350570, '노원구 월계3동': 11350580, '노원구 공릉2동': 11350600, '노원구 하계1동': 11350611, '노원구 하계2동': 11350612, '노원구 중계본동': 11350619, '노원구 중계1동': 11350621, '노원구 중계4동': 11350624, '노원구 상계1동': 11350630, '노원구 상계2동': 11350640, '노원구 상계5동': 11350670, '노원구 상계8동': 11350700, '노원구 상계9동': 11350710, '노원구 상계10동': 11350720, '노원구 상계3.4동': 11350665, '노원구 상계6.7동': 11350695, '노원구 중계2.3동': 11350625, '노원구 공릉1동': 11350595, '은평구 녹번동': 11380510, '은평구 불광1동': 11380520, '은평구 갈현1동': 11380551, '은평구 갈현2동': 11380552, '은평구 구산동': 11380560, '은평구 대조동': 11380570, '은평구 응암1동': 11380580, '은평구 응암2동': 11380590, '은평구 신사1동': 11380631, '은평구 신사2동': 11380632, '은평구 증산동': 11380640, '은평구 수색동': 11380650, '은평구 진관동': 11380690, '은평구 불광2동': 11380530, '은평구 응암3동': 11380600, '은평구 역촌동': 11380625, '서대문구 천연동': 11410520, '서대문구 홍제1동': 11410620, '서대문구 홍제3동': 11410640, '서대문구 홍제2동': 11410655, '서대문구 홍은1동': 11410660, '서대문구 홍은2동': 11410685, '서대문구 남가좌1동': 11410690, '서대문구 남가좌2동': 11410700, '서대문구 북가좌1동': 11410710, '서대문구 북가좌2동': 11410720, '서대문구 충현동': 11410565, '서대문구 북아현동': 11410555, '서대문구 신촌동': 11410585, '서대문구 연희동': 11410615, '마포구 용강동': 11440590, '마포구 대흥동': 11440600, '마포구 염리동': 11440610, '마포구 신수동': 11440630, '마포구 서교동': 11440660, '마포구 합정동': 11440680, '마포구 망원1동': 11440690, '마포구 망원2동': 11440700, '마포구 연남동': 11440710, '마포구 성산1동': 11440720, '마포구 성산2동': 11440730, '마포구 상암동': 11440740, '마포구 도화동': 11440585, '마포구 서강동': 11440655, '마포구 공덕동': 11440565, '마포구 아현동': 11440555, '양천구 목1동': 11470510, '양천구 목2동': 11470520, '양천구 목3동': 11470530, '양천구 목4동': 11470540, '양천구 신월1동': 11470560, '양천구 신월2동': 11470570, '양천구 신월3동': 11470580, '양천구 신월4동': 11470590, '양천구 신월5동': 11470600, '양천구 신월6동': 11470610, '양천구 신월7동': 11470611, '양천구 신정1동': 11470620, '양천구 신정2동': 11470630, '양천구 신정3동': 11470640, '양천구 신정6동': 11470670, '양천구 신정7동': 11470680, '양천구 목5동': 11470550, '양천구 신정4동': 11470650, '강서구 염창동': 11500510, '강서구 등촌1동': 11500520, '강서구 등촌2동': 11500530, '강서구 등촌3동': 11500535, '강서구 화곡본동': 11500590, '강서구 화곡2동': 11500550, '강서구 화곡3동': 11500560, '강서구 화곡4동': 11500570, '강서구 화곡6동': 11500591, '강서구 화곡8동': 11500593, '강서구 가양1동': 11500603, '강서구 가양2동': 11500604, '강서구 가양3동': 11500605, '강서구 발산1동': 11500611, '강서구 공항동': 11500620, '강서구 방화1동': 11500630, '강서구 방화2동': 11500640, '강서구 방화3동': 11500641, '강서구 화곡1동': 11500540, '강서구 우장산동': 11500615, '구로구 신도림동': 11530510, '구로구 구로1동': 11530520, '구로구 구로3동': 11530540, '구로구 구로4동': 11530550, '구로구 구로5동': 11530560, '구로구 고척1동': 11530720, '구로구 고척2동': 11530730, '구로구 개봉2동': 11530750, '구로구 개봉3동': 11530760, '구로구 오류1동': 11530770, '구로구 오류2동': 11530780, '구로구 수궁동': 11530790, '구로구 가리봉동': 11530595, '구로구 구로2동': 11530530, '구로구 개봉1동': 11530740, '금천구 가산동': 11545510, '금천구 독산1동': 11545610, '금천구 독산2동': 11545620, '금천구 독산3동': 11545630, '금천구 독산4동': 11545640, '금천구 시흥1동': 11545670, '금천구 시흥2동': 11545680, '금천구 시흥3동': 11545690, '금천구 시흥4동': 11545700, '금천구 시흥5동': 11545710, '영등포구 여의동': 11560540, '영등포구 당산1동': 11560550, '영등포구 당산2동': 11560560, '영등포구 양평1동': 11560610, '영등포구 양평2동': 11560620, '영등포구 신길1동': 11560630, '영등포구 신길3동': 11560650, '영등포구 신길4동': 11560660, '영등포구 신길5동': 11560670, '영등포구 신길6동': 11560680, '영등포구 신길7동': 11560690, '영등포구 대림1동': 11560700, '영등포구 대림2동': 11560710, '영등포구 대림3동': 11560720, '영등포구 영등포본동': 11560515, '영등포구 영등포동': 11560535, '영등포구 도림동': 11560585, '영등포구 문래동': 11560605, '동작구 노량진2동': 11590520, '동작구 상도1동': 11590530, '동작구 상도2동': 11590540, '동작구 상도3동': 11590550, '동작구 상도4동': 11590560, '동작구 사당1동': 11590620, '동작구 사당3동': 11590640, '동작구 사당4동': 11590650, '동작구 사당5동': 11590651, '동작구 대방동': 11590660, '동작구 신대방1동': 11590670, '동작구 신대방2동': 11590680, '동작구 흑석동': 11590605, '동작구 노량진1동': 11590510, '동작구 사당2동': 11590630, '관악구 보라매동': 11620525, '관악구 청림동': 11620545, '관악구 행운동': 11620575, '관악구 낙성대동': 11620585, '관악구 중앙동': 11620615, '관악구 인헌동': 11620625, '관악구 남현동': 11620630, '관악구 서원동': 11620645, '관악구 신원동': 11620655, '관악구 서림동': 11620665, '관악구 신사동': 11620685, '관악구 신림동': 11620695, '관악구 난향동': 11620715, '관악구 조원동': 11620725, '관악구 대학동': 11620735, '관악구 은천동': 11620605, '관악구 성현동': 11620565, '관악구 청룡동': 11620595, '관악구 난곡동': 11620775, '관악구 삼성동': 11620745, '관악구 미성동': 11620765, '서초구 서초1동': 11650510, '서초구 서초2동': 11650520, '서초구 서초3동': 11650530, '서초구 서초4동': 11650531, '서초구 잠원동': 11650540, '서초구 반포본동': 11650550, '서초구 반포1동': 11650560, '서초구 반포2동': 11650570, '서초구 반포3동': 11650580, '서초구 반포4동': 11650581, '서초구 방배본동': 11650590, '서초구 방배1동': 11650600, '서초구 방배2동': 11650610, '서초구 방배3동': 11650620, '서초구 방배4동': 11650621, '서초구 양재1동': 11650651, '서초구 양재2동': 11650652, '서초구 내곡동': 11650660, '강남구 신사동': 11680510, '강남구 논현1동': 11680521, '강남구 논현2동': 11680531, '강남구 삼성1동': 11680580, '강남구 삼성2동': 11680590, '강남구 대치1동': 11680600, '강남구 대치4동': 11680630, '강남구 역삼1동': 11680640, '강남구 역삼2동': 11680650, '강남구 도곡1동': 11680655, '강남구 도곡2동': 11680656, '강남구 개포1동': 11680660, '강남구 개포4동': 11680690, '강남구 일원본동': 11680720, '강남구 일원1동': 11680730, '강남구 일원2동': 11680740, '강남구 수서동': 11680750, '강남구 세곡동': 11680700, '강남구 압구정동': 11680545, '강남구 청담동': 11680565, '강남구 대치2동': 11680610, '강남구 개포2동': 11680670, '송파구 풍납1동': 11710510, '송파구 풍납2동': 11710520, '송파구 거여1동': 11710531, '송파구 거여2동': 11710532, '송파구 마천1동': 11710540, '송파구 마천2동': 11710550, '송파구 방이1동': 11710561, '송파구 방이2동': 11710562, '송파구 오륜동': 11710566, '송파구 오금동': 11710570, '송파구 송파1동': 11710580, '송파구 송파2동': 11710590, '송파구 석촌동': 11710600, '송파구 삼전동': 11710610, '송파구 가락본동': 11710620, '송파구 가락1동': 11710631, '송파구 가락2동': 11710632, '송파구 문정1동': 11710641, '송파구 문정2동': 11710642, '송파구 잠실본동': 11710650, '송파구 잠실4동': 11710690, '송파구 잠실6동': 11710710, '송파구 잠실7동': 11710720, '송파구 잠실2동': 11710670, '송파구 잠실3동': 11710680, '송파구 장지동': 11710646, '송파구 위례동': 11710647, '강동구 강일동': 11740515, '강동구 상일동': 11740520, '강동구 명일1동': 11740530, '강동구 명일2동': 11740540, '강동구 고덕1동': 11740550, '강동구 고덕2동': 11740560, '강동구 암사2동': 11740580, '강동구 암사3동': 11740590, '강동구 천호1동': 11740600, '강동구 천호3동': 11740620, '강동구 성내1동': 11740640, '강동구 성내2동': 11740650, '강동구 성내3동': 11740660, '강동구 둔촌1동': 11740690, '강동구 둔촌2동': 11740700, '강동구 암사1동': 11740570, '강동구 천호2동': 11740610, '강동구 길동': 11740685} ;

  
  if (event.requestContext.http.method === 'POST'){
    console.log("이벤트 바디", event.body);
    const latLngRad = event.body.split(",");
    console.log("split", latLngRad);

    const addressUrl = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${latLngRad[1]}&y=${latLngRad[0]}`;

    let address = "";
    
    try{
      const addressResponse = await fetch(addressUrl, {
        method: 'GET',
        headers: {
            'Authorization': `KakaoAK ${authKey}`
        }
      });

      const addressData = await addressResponse.json();
        
      if (addressData.documents && addressData.documents.length > 0) {
        addressData.documents.forEach(doc => {
              address = doc.region_2depth_name + " " + doc.region_3depth_name;
          });
      }

      console.log(address);
      const addressCode = addressCodeMapping[address];
      console.log(addressCode);

      const queries = [
        '중식', '돈까스', '회', '일식', '양식', '분식', '고기', '구이', '족발', '보쌈',
        '치킨', '피자', '버거', '찜', '탕', '찌개', '백반', '죽', '국수', '아시안', '주점',
        '샐러드', '도시락', '컵밥', '토스트', '카페', '디저트'
      ];
      
      const sectors = [
        '중식', '돈까스/회/일식', '양식', '분식', '고기/구이', '족발/보쌈', '치킨', '피자', '버거',
        '찜/탕/찌개', '백반/죽/국수', '카페/디저트', '아시안', '주점', '샐러드', '도시락/컵밥/토스트'
      ];
      
      const combinedPlaces = {};

      const getCategoryCode = (query) => {
        if (query === '카페' || query === '디저트') {
            return 'CE7';
        } else {
            return 'FD6';
        }
    }
    
      
      for (const query of queries) {
        for (let i = 1; i <= 3; i++) {
          const params = {
            query: query,
            x: latLngRad[1],
            y: latLngRad[0],
            radius: latLngRad[2],
            page: i,
            size: 15,
            sort: 'distance',
            category_group_code: getCategoryCode(query)
          };
      
          const placesResponse = await axios.get(`https://dapi.kakao.com/v2/local/search/keyword.json`, {
            headers: { 'Authorization': `KakaoAK ${authKey}` },
            params: params
          });
          
          const places = placesResponse.data.documents;
      
          for (const place of places) {
            const id = place.id;
            const sectorForCurrentQuery = sectors.find(s => s.includes(query));
            if (!combinedPlaces[id]) {
              combinedPlaces[id] = {
                id: place.id,
                category_name: place.category_name,
                distance: place.distance,
                place_name: place.place_name,
                sector: [sectorForCurrentQuery]
              };
            } else {
              if (!combinedPlaces[id].sector.includes(sectorForCurrentQuery)) {
                combinedPlaces[id].sector.push(sectorForCurrentQuery);
              }
            }
          }
        }
      }
      
      const finalList = Object.values(combinedPlaces).sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance;
        return a.id - b.id;
      });
      
      const responseBody = {
        addressCode: addressCode,
        list: finalList
      };
      
      return {
          statusCode: 200,
          body: JSON.stringify(responseBody),
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': '*',
              'Access-Control-Allow-Methods': '*'
          },
      };   
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*'
        },
        body: JSON.stringify({ message: 'Internal Server Error' })
      };
    }
} else{
  console.log("프리플라이트");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*'
    },
    body: JSON.stringify({ message: 'Preflight request successful' })
  };
}
};
