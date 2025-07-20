// 게임 상태 관리
let gameState = {
    player: null,
    currentWeek: 1,
    currentSeason: 1,
    currentYear: 2024,
    matchHistory: [],
    events: [],
    settings: {
        autoSave: true,
        soundEffects: true
    }
};

// 배경별 초기 설정
const backgroundModifiers = {
    poor_talent: {
        ratingModifier: -10,
        potentialModifier: +15,
        mentalBonus: +5,
        startingTeam: "지역 아마추어팀",
        startingSalary: 50000,
        description: "가난한 환경에서 자란 천재적 재능"
    },
    elite_youth: {
        ratingModifier: +5,
        potentialModifier: +5,
        mentalBonus: 0,
        startingTeam: "명문 유소년팀",
        startingSalary: 200000,
        description: "체계적인 교육을 받은 엘리트"
    },
    injury_comeback: {
        ratingModifier: -5,
        potentialModifier: +10,
        mentalBonus: +10,
        startingTeam: "재활 센터팀",
        startingSalary: 100000,
        description: "부상을 극복한 강인한 정신력"
    }
};

// 나이별 잠재력 설정
const agePotentialMap = {
    16: 95,
    17: 90,
    18: 85,
    19: 80
};

// 게임 초기화
function initializeGame() {
    // 기본 상태로 리셋
    gameState = {
        player: null,
        currentWeek: 1,
        currentSeason: 1,
        currentYear: 2024,
        matchHistory: [],
        events: [],
        settings: {
            autoSave: true,
            soundEffects: true
        }
    };
}

// 선수 생성 (새로운 선수)
function createNewPlayerData(name, position, age, background) {
    const backgroundMod = backgroundModifiers[background];
    const basePotential = agePotentialMap[age];
    
    // 포지션별 기본 능력치
    const baseRatings = getBaseRatingsByPosition(position);
    
    const player = {
        // 기본 정보
        name: name,
        position: position,
        age: parseInt(age),
        background: background,
        
        // 능력치
        rating: Math.max(50, Math.min(85, baseRatings.overall + backgroundMod.ratingModifier)),
        potential: Math.min(99, basePotential + backgroundMod.potentialModifier),
        
        // 상태
        condition: 85,
        fatigue: 10,
        form: 75,
        morale: 70 + backgroundMod.mentalBonus,
        
        // 경력
        team: backgroundMod.startingTeam,
        salary: backgroundMod.startingSalary,
        contractYears: 2,
        fame: 5,
        
        // 통계
        careerStats: {
            appearances: 0,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
            averageRating: 6.0
        },
        
        // 특성
        traits: [],
        skills: [],
        
        // 성장 관련
        trainingFocus: {
            physical: 2,
            technical: 2,
            mental: 2
        },
        
        // 기타
        isRealPlayer: false,
        originalTeam: null
    };
    
    return player;
}

// 실제 선수로 게임 시작
function createRealPlayerData(realPlayer) {
    const player = {
        // 기본 정보
        name: realPlayer.name,
        position: realPlayer.position,
        age: realPlayer.age,
        background: "real_player",
        
        // 능력치 (실제 선수는 현재 레이팅을 기반으로)
        rating: realPlayer.rating,
        potential: calculatePotentialFromAge(realPlayer.age, realPlayer.rating),
        
        // 상태
        condition: 85,
        fatigue: 10,
        form: 75,
        morale: 75,
        
        // 경력
        team: realPlayer.teamName,
        salary: calculateSalaryFromRating(realPlayer.rating),
        contractYears: Math.floor(Math.random() * 3) + 1,
        fame: calculateFameFromRating(realPlayer.rating),
        
        // 통계
        careerStats: {
            appearances: Math.floor(Math.random() * 100) + 50,
            goals: realPlayer.position === "FW" ? Math.floor(Math.random() * 50) + 10 : Math.floor(Math.random() * 10),
            assists: Math.floor(Math.random() * 20) + 5,
            yellowCards: Math.floor(Math.random() * 10),
            redCards: Math.floor(Math.random() * 3),
            averageRating: (realPlayer.rating / 10).toFixed(1)
        },
        
        // 특성
        traits: generateTraitsFromRating(realPlayer.rating),
        skills: generateSkillsFromPosition(realPlayer.position),
        
        // 성장 관련
        trainingFocus: {
            physical: 2,
            technical: 2,
            mental: 2
        },
        
        // 기타
        isRealPlayer: true,
        originalTeam: realPlayer.team
    };
    
    return player;
}

// 포지션별 기본 능력치 계산
function getBaseRatingsByPosition(position) {
    const baseRatings = {
        GK: { overall: 65 },
        DF: { overall: 68 },
        MF: { overall: 70 },
        FW: { overall: 72 }
    };
    
    return baseRatings[position] || baseRatings.MF;
}

// 나이와 레이팅으로 잠재력 계산
function calculatePotentialFromAge(age, rating) {
    if (age <= 20) return Math.min(99, rating + 15);
    if (age <= 25) return Math.min(99, rating + 10);
    if (age <= 28) return Math.min(99, rating + 5);
    if (age <= 32) return rating;
    return Math.max(rating - 5, 60);
}

// 레이팅으로 주급 계산
function calculateSalaryFromRating(rating) {
    return Math.floor((rating - 50) * 50000) + 100000;
}

// 레이팅으로 명성 계산
function calculateFameFromRating(rating) {
    if (rating >= 90) return 95;
    if (rating >= 85) return 80;
    if (rating >= 80) return 65;
    if (rating >= 75) return 50;
    if (rating >= 70) return 35;
    return 20;
}

// 레이팅으로 특성 생성
function generateTraitsFromRating(rating) {
    const traits = [];
    
    if (rating >= 90) {
        traits.push("월드클래스", "리더십");
    } else if (rating >= 85) {
        traits.push("스타급", "경험 풍부");
    } else if (rating >= 80) {
        traits.push("주전급", "안정적");
    } else if (rating >= 75) {
        traits.push("유망주", "성실함");
    }
    
    return traits;
}

// 포지션별 기술 생성
function generateSkillsFromPosition(position) {
    const skillsByPosition = {
        GK: ["골키핑", "반응속도", "커맨드"],
        DF: ["태클", "헤딩", "마크"],
        MF: ["패스", "볼컨트롤", "시야"],
        FW: ["슈팅", "드리블", "오프더볼"]
    };
    
    return skillsByPosition[position] || skillsByPosition.MF;
}

// 게임 저장
function saveGameState() {
    try {
        const saveData = JSON.stringify(gameState);
        window.localStorage.setItem('footballStory_save', saveData);
        return true;
    } catch (error) {
        console.error('게임 저장 실패:', error);
        return false;
    }
}

// 게임 불러오기
function loadGameState() {
    try {
        const saveData = window.localStorage.getItem('footballStory_save');
        if (saveData) {
            gameState = JSON.parse(saveData);
            return true;
        }
        return false;
    } catch (error) {
        console.error('게임 불러오기 실패:', error);
        return false;
    }
}

// JSON 파일로 내보내기
function exportGameToFile() {
    const dataStr = JSON.stringify(gameState, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `축구스토리_${gameState.player.name}_시즌${gameState.currentSeason}.json`;
    link.click();
}

// JSON 파일에서 가져오기
function importGameFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                gameState = importedData;
                resolve(true);
            } catch (error) {
                reject(error);
            }
        };
        reader.readAsText(file);
    });
}

// 자동 저장
function autoSave() {
    if (gameState.settings.autoSave) {
        saveGameState();
    }
}

// 다음 주로 이동
function advanceWeek() {
    gameState.currentWeek++;
    
    // 시즌 변경 체크
    if (gameState.currentWeek > 38) {
        gameState.currentWeek = 1;
        gameState.currentSeason++;
        gameState.currentYear++;
        
        // 선수 나이 증가
        if (gameState.player) {
            gameState.player.age++;
        }
        
        // 시즌 종료 이벤트 생성
        generateSeasonEndEvent();
    }
    
    // 주간 이벤트 생성
    generateWeeklyEvents();
    
    // 자동 저장
    autoSave();
}

// 게임 상태 검증
function validateGameState() {
    if (!gameState.player) {
        console.error('플레이어 데이터가 없습니다.');
        return false;
    }
    
    if (gameState.currentWeek < 1 || gameState.currentWeek > 38) {
        console.error('잘못된 주차 데이터입니다.');
        return false;
    }
    
    return true;
}
