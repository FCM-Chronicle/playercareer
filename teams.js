// 팀 및 선수 데이터
const teams = {
    tottenham: [
        { name: "비카리오", position: "GK", rating: 82, age: 27 },
        { name: "레길론", position: "DF", rating: 78, age: 27 },
        { name: "드라구신", position: "DF", rating: 75, age: 24 },
        { name: "손흥민", position: "FW", rating: 90, age: 31 },
        { name: "비수마", position: "MF", rating: 80, age: 28 },
        { name: "히샬리송", position: "FW", rating: 83, age: 26 },
        { name: "매디슨", position: "MF", rating: 85, age: 27 },
        { name: "우도기", position: "DF", rating: 83, age: 25 },
        { name: "그레이", position: "MF", rating: 84, age: 19 },
        { name: "베리발", position: "MF", rating: 84, age: 19 },
        { name: "베르너", position: "FW", rating: 75, age: 29 },
        { name: "로메로", position: "DF", rating: 85, age: 25 },
        { name: "솔랑케", position: "FW", rating: 83, age: 26 },
        { name: "포스터", position: "GK", rating: 70, age: 33 },
        { name: "마티스 텔", position: "FW", rating: 81, age: 19 },
        { name: "쿨루셉스키", position: "FW", rating: 84, age: 23 },
        { name: "케빈 단소", position: "DF", rating: 81, age: 26 },
        { name: "브레넌 존슨", position: "FW", rating: 84, age: 22 },
        { name: "페드로 포로", position: "DF", rating: 82, age: 24 },
        { name: "스펜스", position: "DF", rating: 76, age: 22 },
        { name: "오도베르", position: "MF", rating: 76, age: 21 },
        { name: "P. M. 사르", position: "MF", rating: 80, age: 21 },
        { name: "벤탕쿠르", position: "MF", rating: 82, age: 26 },
        { name: "데이비스", position: "DF", rating: 77, age: 30 },
        { name: "판더펜", position: "DF", rating: 84, age: 22 },
        { name: "오스틴", position: "GK", rating: 71, age: 25 },
        { name: "화이트먼", position: "GK", rating: 69, age: 23 },
        { name: "양민혁", position: "FW", rating: 85, age: 18 }
    ],
    liverpool: [
        { name: "알리송", position: "GK", rating: 89, age: 27 },
        { name: "조 고메즈", position: "DF", rating: 78, age: 26 },
        { name: "엔도", position: "MF", rating: 76, age: 25 },
        { name: "반 다이크", position: "DF", rating: 90, age: 31 },
        { name: "코나테", position: "DF", rating: 84, age: 24 },
        { name: "루이스 디아스", position: "FW", rating: 85, age: 26 },
        { name: "소보슬라이", position: "MF", rating: 83, age: 22 },
        { name: "누녜스", position: "FW", rating: 77, age: 25 },
        { name: "맥 알리스터", position: "MF", rating: 83, age: 25 },
        { name: "M. 살라", position: "FW", rating: 92, age: 31 },
        { name: "키에사", position: "FW", rating: 84, age: 25 },
        { name: "존스", position: "MF", rating: 79, age: 22 },
        { name: "각포", position: "MF", rating: 77, age: 23 },
        { name: "엘리엇", position: "MF", rating: 76, age: 20 },
        { name: "디오구 J.", position: "FW", rating: 83, age: 26 },
        { name: "치미카스", position: "DF", rating: 80, age: 27 },
        { name: "로버트슨", position: "DF", rating: 85, age: 29 },
        { name: "흐라벤베르흐", position: "MF", rating: 87, age: 21 },
        { name: "야로스", position: "GK", rating: 70, age: 23 },
        { name: "켈러허", position: "GK", rating: 77, age: 25 },
        { name: "콴사", position: "DF", rating: 71, age: 19 },
        { name: "모튼", position: "MF", rating: 69, age: 20 },
        { name: "브래들리", position: "DF", rating: 69, age: 22 },
        { name: "데이비스", position: "DF", rating: 72, age: 25 }
    ],
    manCity: [
        { name: "후벵 디아스", position: "DF", rating: 85, age: 29 },
        { name: "존 스톤스", position: "DF", rating: 82, age: 29 },
        { name: "네이선 아케", position: "DF", rating: 82, age: 24 },
        { name: "코바치치", position: "MF", rating: 81, age: 29 },
        { name: "홀란드", position: "FW", rating: 92, age: 23 },
        { name: "그릴리쉬", position: "FW", rating: 84, age: 28 },
        { name: "로드리", position: "MF", rating: 92, age: 27 },
        { name: "오르테가 모레노", position: "GK", rating: 75, age: 30 },
        { name: "귄도안", position: "MF", rating: 78, age: 32 },
        { name: "B.실바", position: "MF", rating: 87, age: 29 },
        { name: "그바르디올", position: "DF", rating: 85, age: 22 },
        { name: "아칸지", position: "DF", rating: 80, age: 28 },
        { name: "사비뉴", position: "FW", rating: 78, age: 25 },
        { name: "라얀 셰르키", position: "MF", rating: 85, age: 21 },
        { name: "마테우스 N.", position: "DF", rating: 78, age: 23 },
        { name: "에데르송 M.", position: "GK", rating: 88, age: 30 },
        { name: "후사노프", position: "DF", rating: 78, age: 21 },
        { name: "포든", position: "FW", rating: 86, age: 23 },
        { name: "리코 루이스", position: "DF", rating: 72, age: 19 },
        { name: "매카티", position: "MF", rating: 71, age: 20 },
        { name: "윌슨-에스브랜드", position: "FW", rating: 73, age: 21 },
        { name: "O.마르무시", position: "FW", rating: 85, age: 25 },
        { name: "오라일리", position: "DF", rating: 78, age: 20 }
    ],
    arsenal: [
        { name: "키어런 티어니", position: "DF", rating: 80, age: 26 },
        { name: "벤 화이트", position: "DF", rating: 82, age: 25 },
        { name: "토마스 파티", position: "MF", rating: 85, age: 30 },
        { name: "가브리엘 마갈량이스", position: "DF", rating: 83, age: 25 },
        { name: "부카요 사카", position: "FW", rating: 88, age: 22 },
        { name: "마르틴 외데고르", position: "MF", rating: 87, age: 25 },
        { name: "가브리엘 제주스", position: "FW", rating: 84, age: 26 },
        { name: "가브리엘 마르티넬리", position: "FW", rating: 86, age: 22 },
        { name: "유리언 팀버르", position: "DF", rating: 78, age: 23 },
        { name: "야쿠프 키비오르", position: "DF", rating: 76, age: 24 },
        { name: "올렉산드르 진첸코", position: "DF", rating: 81, age: 27 },
        { name: "도미야스 다케히로", position: "DF", rating: 79, age: 26 },
        { name: "레안드로 트로사르", position: "FW", rating: 80, age: 28 },
        { name: "조르지뉴", position: "MF", rating: 82, age: 31 },
        { name: "다비드 라야", position: "GK", rating: 83, age: 28 },
        { name: "미켈 메리노", position: "MF", rating: 84, age: 26 },
        { name: "카이 하베르츠", position: "FW", rating: 84, age: 24 },
        { name: "라힘 스털링", position: "FW", rating: 76, age: 29 },
        { name: "리카르도 칼라피오리", position: "DF", rating: 74, age: 22 },
        { name: "데클런 라이스", position: "MF", rating: 90, age: 24 }
    ],
    realMadrid: [
        { name: "티보 쿠르투아", position: "GK", rating: 90, age: 31 },
        { name: "다니 카르바할", position: "DF", rating: 84, age: 31 },
        { name: "에데르 밀리탕", position: "DF", rating: 87, age: 25 },
        { name: "데이비드 알라바", position: "DF", rating: 78, age: 30 },
        { name: "주드 벨링엄", position: "MF", rating: 91, age: 20 },
        { name: "에두아르도 카마빙가", position: "MF", rating: 84, age: 21 },
        { name: "비니시우스 주니오르", position: "FW", rating: 89, age: 23 },
        { name: "페데리코 발베르데", position: "MF", rating: 89, age: 25 },
        { name: "킬리안 음바페", position: "FW", rating: 93, age: 25 },
        { name: "루카 모드리치", position: "MF", rating: 88, age: 38 },
        { name: "호드리구", position: "FW", rating: 88, age: 22 },
        { name: "안드리 루닌", position: "GK", rating: 76, age: 24 },
        { name: "오렐리앵 추아메니", position: "MF", rating: 88, age: 23 },
        { name: "아르다 귈러", position: "FW", rating: 83, age: 19 },
        { name: "엔드릭", position: "FW", rating: 80, age: 18 },
        { name: "루카스 바스케스", position: "DF", rating: 77, age: 32 },
        { name: "헤수스 바예호", position: "DF", rating: 74, age: 25 },
        { name: "다니 세바요스", position: "MF", rating: 79, age: 27 },
        { name: "프란 가르시아", position: "DF", rating: 73, age: 24 },
        { name: "안토니오 뤼디거", position: "DF", rating: 90, age: 30 },
        { name: "페를랑 멘디", position: "DF", rating: 80, age: 28 },
        { name: "딘 하위선", position: "DF", rating: 83, age: 20 },
        { name: "T. A. 아놀드", position: "DF", rating: 87, age: 26 }
    ],
    barcelona: [
        { name: "테어 슈테겐", position: "GK", rating: 89, age: 31 },
        { name: "파우 쿠바르시", position: "DF", rating: 84, age: 19 },
        { name: "알레한드로 발데", position: "DF", rating: 83, age: 20 },
        { name: "로날드 아라우호", position: "DF", rating: 82, age: 24 },
        { name: "이니고 마르티네스", position: "DF", rating: 80, age: 32 },
        { name: "가비", position: "MF", rating: 83, age: 19 },
        { name: "페란 토레스", position: "FW", rating: 80, age: 23 },
        { name: "페드리", position: "MF", rating: 88, age: 20 },
        { name: "로베르트 레반도프스키", position: "FW", rating: 91, age: 38 },
        { name: "안수 파티", position: "FW", rating: 75, age: 20 },
        { name: "하피냐", position: "FW", rating: 90, age: 26 },
        { name: "이냐키 페냐", position: "GK", rating: 76, age: 23 },
        { name: "파블로 토레", position: "MF", rating: 75, age: 19 },
        { name: "안드레아스 크리스텐센", position: "DF", rating: 80, age: 27 },
        { name: "페르민 로페스", position: "MF", rating: 78, age: 23 },
        { name: "마르크 카사도", position: "DF", rating: 73, age: 21 },
        { name: "파우 빅토르", position: "DF", rating: 70, age: 21 },
        { name: "라민 야말", position: "FW", rating: 90, age: 17 },
        { name: "다니 올모", position: "MF", rating: 83, age: 25 },
        { name: "프렝키 더 용", position: "MF", rating: 86, age: 26 },
        { name: "쥘 쿤데", position: "DF", rating: 84, age: 25 },
        { name: "에리크 가르시아", position: "DF", rating: 79, age: 24 },
        { name: "보이치에흐 슈쳉스니", position: "GK", rating: 81, age: 33 }
    ],
    bayern: [
        { name: "마누엘 노이어", position: "GK", rating: 90, age: 37 },
        { name: "다요 우파메카노", position: "DF", rating: 83, age: 25 },
        { name: "김민재", position: "DF", rating: 87, age: 27 },
        { name: "요주아 키미히", position: "MF", rating: 88, age: 28 },
        { name: "세르주 그나브리", position: "FW", rating: 82, age: 28 },
        { name: "레온 고레츠카", position: "MF", rating: 84, age: 28 },
        { name: "해리 케인", position: "FW", rating: 92, age: 30 },
        { name: "리로이 자네", position: "FW", rating: 83, age: 28 },
        { name: "킹슬레 코망", position: "FW", rating: 82, age: 28 },
        { name: "알폰소 데이비스", position: "DF", rating: 87, age: 23 },
        { name: "주앙 팔리냐", position: "MF", rating: 80, age: 28 },
        { name: "다니엘 페레츠", position: "GK", rating: 75, age: 26 },
        { name: "다니엘 산체스", position: "DF", rating: 79, age: 28 },
        { name: "하파엘 게헤이루", position: "DF", rating: 78, age: 27 },
        { name: "마이클 올리스", position: "FW", rating: 86, age: 25 },
        { name: "다니엘 베르너", position: "FW", rating: 79, age: 28 },
        { name: "이토 히로키", position: "DF", rating: 80, age: 26 },
        { name: "타레크 부흐만", position: "MF", rating: 74, age: 22 },
        { name: "마르코 레흐너", position: "DF", rating: 73, age: 21 },
        { name: "자말 무시알라", position: "MF", rating: 88, age: 20 },
        { name: "스벤 울라이히", position: "GK", rating: 76, age: 29 },
        { name: "콘라트 라이머", position: "MF", rating: 75, age: 29 },
        { name: "요시프 스타니시치", position: "DF", rating: 73, age: 23 },
        { name: "알렉산다르 파블로비치", position: "DF", rating: 72, age: 27 }
    ],
    psg: [
        { name: "잔루이지 돈나룸마", position: "GK", rating: 89, age: 24 },
        { name: "아슈라프 하키미", position: "DF", rating: 85, age: 25 },
        { name: "프레스넬 킴펨베", position: "DF", rating: 83, age: 28 },
        { name: "마르키뉴스", position: "DF", rating: 87, age: 29 },
        { name: "파비안 루이스", position: "MF", rating: 81, age: 27 },
        { name: "곤살루 하무스", position: "FW", rating: 82, age: 27 },
        { name: "우스만 뎀벨레", position: "FW", rating: 90, age: 26 },
        { name: "데지레 두에", position: "FW", rating: 88, age: 20 },
        { name: "비티냐", position: "MF", rating: 86, age: 23 },
        { name: "이강인", position: "MF", rating: 83, age: 22 },
        { name: "뤼카 E.", position: "DF", rating: 82, age: 27 },
        { name: "세니 마율루", position: "DF", rating: 75, age: 23 },
        { name: "누누 멘데스", position: "DF", rating: 87, age: 21 },
        { name: "브래들리 바르콜라", position: "FW", rating: 84, age: 22 },
        { name: "워렌 자이르에메리", position: "MF", rating: 83, age: 18 },
        { name: "루카스 베라우두", position: "MF", rating: 76, age: 20 },
        { name: "마트베이 사포노프", position: "GK", rating: 75, age: 29 },
        { name: "크바라츠헬리아", position: "FW", rating: 90, age: 22 },
        { name: "요람 자그", position: "DF", rating: 70, age: 21 },
        { name: "이브라힘 음바예", position: "FW", rating: 73, age: 22 },
        { name: "주앙 네베스", position: "MF", rating: 78, age: 23 },
        { name: "아르나우 테나스", position: "GK", rating: 76, age: 22 }
    ]
};

// 팀 이름 매핑
const teamNames = {
    tottenham: "토트넘 홋스퍼",
    liverpool: "리버풀 FC",
    manCity: "맨체스터 시티",
    arsenal: "아스날 FC", 
    realMadrid: "레알 마드리드",
    barcelona: "FC 바르셀로나",
    bayern: "바이에른 뮌헨",
    psg: "파리 생제르맹"
};

// 포지션 이름 매핑
const positionNames = {
    GK: "골키퍼",
    DF: "수비수", 
    MF: "미드필더",
    FW: "공격수"
};

// 모든 선수를 하나의 배열로 합치기 (팀 정보 포함)
function getAllPlayers() {
    const allPlayers = [];
    
    for (const [teamKey, players] of Object.entries(teams)) {
        players.forEach(player => {
            allPlayers.push({
                ...player,
                team: teamKey,
                teamName: teamNames[teamKey]
            });
        });
    }
    
    return allPlayers;
}

// 특정 조건으로 선수 필터링
function filterPlayersByTeam(teamKey) {
    if (teamKey === 'all') {
        return getAllPlayers();
    }
    return teams[teamKey] ? teams[teamKey].map(player => ({
        ...player,
        team: teamKey,
        teamName: teamNames[teamKey]
    })) : [];
}

function filterPlayersByPosition(position) {
    const allPlayers = getAllPlayers();
    return allPlayers.filter(player => player.position === position);
}

function searchPlayersByName(searchTerm) {
    const allPlayers = getAllPlayers();
    return allPlayers.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
}
