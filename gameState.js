// 게임 상태 관리 (슈퍼리그 시스템)
let gameState = {
    player: null,
    currentWeek: 1,
    currentSeason: 1,
    currentYear: 2024,
    league: {
        teams: [], // 18개 팀
        standings: [], // 순위표
        fixtures: [], // 경기 일정
        results: [], // 경기 결과
        topScorers: [], // 득점왕
        topAssists: [] // 도움왕
    },
    nationalTeam: {
        eligible: false, // 국가대표 자격
        competitions: [], // 대륙컵, 월드컵
        callUps: [] // 소집 이력
    },
    transferMarket: {
        available: [], // 이적 가능한 선수들
        offers: [] // 이적 제안
    },
    events: [],
    settings: {
        autoSave: false, // 로컬스토리지 비활성화
        soundEffects: true
    }
};

// 선수 생성 (새로운 선수)
function createNewPlayerData(name, position, age, background) {
    console.log('createNewPlayerData 호출:', { name, position, age, background });
    
    const backgroundMod = backgroundModifiers[background];
    const basePotential = agePotentialMap[parseInt(age)];
    
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
        
        // 주간 상태
        trainedThisWeek: false,
        playedMatchThisWeek: false,
        
        // 기타
        isRealPlayer: false,
        originalTeam: null
    };
    
    console.log('새 선수 생성 완료:', player);
    return player;
}

// 실제 선수로 게임 시작
function createRealPlayerData(realPlayer) {
    console.log('createRealPlayerData 호출:', realPlayer);
    
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
        
        // 주간 상태
        trainedThisWeek: false,
        playedMatchThisWeek: false,
        
        // 기타
        isRealPlayer: true,
        originalTeam: realPlayer.team
    };
    
    console.log('실제 선수 생성 완료:', player);
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

// 슈퍼리그 참가 팀 목록 (18개팀)
const superLeagueTeams = [
    'tottenham', 'liverpool', 'manCity', 'arsenal', // 프리미어리그
    'realMadrid', 'barcelona', // 라리가
    'bayern', // 분데스리가
    'psg', // 리그1
    'acMilan', 'inter', 'napoli', 'asRoma', // 세리에A
    'leverkusen', 'dortmund', // 분데스리가
    'newCastle', 'chelsea', 'atMadrid' // 추가팀들
];

// 국가별 선수 매핑 (간단화)
const playerNationalities = {
    // 한국 선수들
    '손흥민': 'KOR',
    '김민재': 'KOR',
    '이강인': 'KOR',
    '양민혁': 'KOR',
    
    // 일본 선수들
    '이토 히로키': 'JPN',
    '도미야스 다케히로': 'JPN',
    
    // 브라질 선수들
    '비니시우스 주니오르': 'BRA',
    '하피냐': 'BRA',
    '알리송': 'BRA',
    '카세미루': 'BRA',
    
    // 아르헨티나 선수들
    'M. 살라': 'EGY',
    '리오넬 메시': 'ARG', // 가상 추가
    
    // 프랑스 선수들
    '킬리안 음바페': 'FRA',
    '그리즈만': 'FRA',
    '테어 슈테겐': 'GER',
    
    // 영국 선수들
    '해리 케인': 'ENG',
    '주드 벨링엄': 'ENG',
    '부카요 사카': 'ENG'
};

// 대회 일정 (연도별)
const competitions = {
    2024: [
        { name: 'UEFA 유로 2024', type: 'continental', weeks: [20, 22] },
        { name: '코파 아메리카 2024', type: 'continental', weeks: [24, 26] }
    ],
    2025: [
        { name: '아시안컵 2025', type: 'continental', weeks: [15, 17] }
    ],
    2026: [
        { name: '월드컵 2026', type: 'worldcup', weeks: [20, 24] }
    ]
};

// 배경별 초기 설정 (수정)
const backgroundModifiers = {
    poor_talent: {
        ratingModifier: -10,
        potentialModifier: +15,
        mentalBonus: +5,
        startingTeam: getRandomSuperLeagueTeam(),
        startingSalary: 50000,
        description: "가난한 환경에서 자란 천재적 재능"
    },
    elite_youth: {
        ratingModifier: +5,
        potentialModifier: +5,
        mentalBonus: 0,
        startingTeam: getRandomSuperLeagueTeam(),
        startingSalary: 200000,
        description: "체계적인 교육을 받은 엘리트"
    },
    injury_comeback: {
        ratingModifier: -5,
        potentialModifier: +10,
        mentalBonus: +10,
        startingTeam: getRandomSuperLeagueTeam(),
        startingSalary: 100000,
        description: "부상을 극복한 강인한 정신력"
    }
};

// 무작위 슈퍼리그 팀 선택
function getRandomSuperLeagueTeam() {
    const randomTeam = superLeagueTeams[Math.floor(Math.random() * superLeagueTeams.length)];
    return teamNames[randomTeam];
}

// 슈퍼리그 초기화
function initializeSuperLeague() {
    gameState.league.teams = superLeagueTeams.map(teamKey => ({
        key: teamKey,
        name: teamNames[teamKey],
        players: teams[teamKey],
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
    }));
    
    // 경기 일정 생성
    generateFixtures();
    
    // 득점왕/도움왕 초기화
    initializeLeaderboards();
}

// 경기 일정 생성 (34경기 - 홈/어웨이)
function generateFixtures() {
    gameState.league.fixtures = [];
    
    for (let week = 1; week <= 34; week++) {
        const weekFixtures = [];
        const availableTeams = [...gameState.league.teams];
        
        // 한 주에 9경기 (18팀)
        while (availableTeams.length >= 2) {
            const team1 = availableTeams.splice(Math.floor(Math.random() * availableTeams.length), 1)[0];
            const team2 = availableTeams.splice(Math.floor(Math.random() * availableTeams.length), 1)[0];
            
            weekFixtures.push({
                home: team1.key,
                away: team2.key,
                homeName: team1.name,
                awayName: team2.name,
                played: false,
                homeGoals: null,
                awayGoals: null,
                homeScorers: [],
                awayScorers: [],
                homeAssists: [],
                awayAssists: []
            });
        }
        
        gameState.league.fixtures[week - 1] = weekFixtures;
    }
}

// 득점왕/도움왕 보드 초기화
function initializeLeaderboards() {
    gameState.league.topScorers = [];
    gameState.league.topAssists = [];
    
    // 모든 선수를 보드에 추가
    gameState.league.teams.forEach(team => {
        team.players.forEach(player => {
            gameState.league.topScorers.push({
                name: player.name,
                team: team.name,
                goals: 0,
                nationality: playerNationalities[player.name] || 'OTHER'
            });
            
            gameState.league.topAssists.push({
                name: player.name,
                team: team.name,
                assists: 0,
                nationality: playerNationalities[player.name] || 'OTHER'
            });
        });
    });
}

// 리그 경기 시뮬레이션
function simulateLeagueMatches(currentWeek) {
    const weekFixtures = gameState.league.fixtures[currentWeek - 1];
    
    weekFixtures.forEach(fixture => {
        if (!fixture.played) {
            simulateMatch(fixture);
            fixture.played = true;
        }
    });
    
    // 순위표 업데이트
    updateStandings();
    
    // 득점왕/도움왕 정렬
    sortLeaderboards();
}

// 개별 경기 시뮬레이션
function simulateMatch(fixture) {
    const homeTeam = gameState.league.teams.find(t => t.key === fixture.home);
    const awayTeam = gameState.league.teams.find(t => t.key === fixture.away);
    
    // 팀 실력 계산
    const homeStrength = calculateTeamStrength(homeTeam) + 5; // 홈 어드밴티지
    const awayStrength = calculateTeamStrength(awayTeam);
    
    // 골 수 결정
    const homeGoals = Math.floor(Math.random() * 5);
    const awayGoals = Math.floor(Math.random() * 4);
    
    fixture.homeGoals = homeGoals;
    fixture.awayGoals = awayGoals;
    
    // 득점자/도움 생성
    generateScorers(fixture, homeTeam, homeGoals, 'home');
    generateScorers(fixture, awayTeam, awayGoals, 'away');
    
    // 팀 스탯 업데이트
    updateTeamStats(homeTeam, homeGoals, awayGoals);
    updateTeamStats(awayTeam, awayGoals, homeGoals);
    
    // 콘솔에 결과 출력
    console.log(`⚽ ${fixture.homeName} ${homeGoals}:${awayGoals} ${fixture.awayName}`);
    if (fixture.homeScorers.length > 0) {
        console.log(`📊 ${fixture.homeName} 득점: ${fixture.homeScorers.join(', ')}`);
    }
    if (fixture.awayScorers.length > 0) {
        console.log(`📊 ${fixture.awayName} 득점: ${fixture.awayScorers.join(', ')}`);
    }
    if (fixture.homeAssists.length > 0) {
        console.log(`🅰️ ${fixture.homeName} 어시스트: ${fixture.homeAssists.join(', ')}`);
    }
    if (fixture.awayAssists.length > 0) {
        console.log(`🅰️ ${fixture.awayName} 어시스트: ${fixture.awayAssists.join(', ')}`);
    }
}

// 팀 실력 계산
function calculateTeamStrength(team) {
    const avgRating = team.players.reduce((sum, player) => sum + player.rating, 0) / team.players.length;
    return avgRating;
}

// 득점자/어시스트 생성
function generateScorers(fixture, team, goals, side) {
    for (let i = 0; i < goals; i++) {
        // 공격수가 득점할 확률이 높음
        const attackers = team.players.filter(p => p.position === 'FW');
        const midfielders = team.players.filter(p => p.position === 'MF');
        const defenders = team.players.filter(p => p.position === 'DF');
        
        let scorer;
        const random = Math.random();
        
        if (random < 0.6 && attackers.length > 0) {
            scorer = attackers[Math.floor(Math.random() * attackers.length)];
        } else if (random < 0.85 && midfielders.length > 0) {
            scorer = midfielders[Math.floor(Math.random() * midfielders.length)];
        } else if (defenders.length > 0) {
            scorer = defenders[Math.floor(Math.random() * defenders.length)];
        } else {
            scorer = team.players[Math.floor(Math.random() * team.players.length)];
        }
        
        // 득점자 추가
        if (side === 'home') {
            fixture.homeScorers.push(scorer.name);
        } else {
            fixture.awayScorers.push(scorer.name);
        }
        
        // 득점왕 보드 업데이트
        const scorerStat = gameState.league.topScorers.find(s => s.name === scorer.name);
        if (scorerStat) {
            scorerStat.goals++;
        }
        
        // 어시스트 (50% 확률)
        if (Math.random() < 0.5) {
            const assistPlayers = team.players.filter(p => p.name !== scorer.name);
            if (assistPlayers.length > 0) {
                const assist = assistPlayers[Math.floor(Math.random() * assistPlayers.length)];
                
                if (side === 'home') {
                    fixture.homeAssists.push(assist.name);
                } else {
                    fixture.awayAssists.push(assist.name);
                }
                
                // 어시스트 보드 업데이트
                const assistStat = gameState.league.topAssists.find(a => a.name === assist.name);
                if (assistStat) {
                    assistStat.assists++;
                }
            }
        }
    }
}

// 팀 스탯 업데이트
function updateTeamStats(team, goalsFor, goalsAgainst) {
    team.goalsFor += goalsFor;
    team.goalsAgainst += goalsAgainst;
    
    if (goalsFor > goalsAgainst) {
        team.wins++;
        team.points += 3;
    } else if (goalsFor === goalsAgainst) {
        team.draws++;
        team.points += 1;
    } else {
        team.losses++;
    }
}

// 순위표 업데이트
function updateStandings() {
    gameState.league.standings = [...gameState.league.teams].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const aGD = a.goalsFor - a.goalsAgainst;
        const bGD = b.goalsFor - b.goalsAgainst;
        if (bGD !== aGD) return bGD - aGD;
        return b.goalsFor - a.goalsFor;
    });
}

// 득점왕/도움왕 정렬
function sortLeaderboards() {
    gameState.league.topScorers.sort((a, b) => b.goals - a.goals);
    gameState.league.topAssists.sort((a, b) => b.assists - a.assists);
}

// 국가대표 자격 체크
function checkNationalTeamEligibility(player) {
    const nationality = playerNationalities[player.name] || 'OTHER';
    const rating = calculateOverallRating(player);
    const fame = player.fame;
    
    // 한국 선수이고, 레이팅 75 이상, 명성 50 이상
    if (nationality === 'KOR' && rating >= 75 && fame >= 50) {
        return true;
    }
    
    // 다른 국가는 더 높은 기준
    if (nationality !== 'OTHER' && rating >= 80 && fame >= 70) {
        return true;
    }
    
    return false;
}

// 국가대표 대회 체크
function checkNationalCompetitions(currentYear, currentWeek) {
    const yearCompetitions = competitions[currentYear];
    if (!yearCompetitions) return null;
    
    for (const comp of yearCompetitions) {
        if (currentWeek >= comp.weeks[0] && currentWeek <= comp.weeks[1]) {
            return comp;
        }
    }
    
    return null;
}

// 이적 시장 초기화
function initializeTransferMarket() {
    gameState.transferMarket.available = [];
    
    // 각 팀에서 일부 선수들을 이적 시장에 등록
    gameState.league.teams.forEach(team => {
        const transferPlayers = team.players.filter(() => Math.random() < 0.1); // 10% 확률
        transferPlayers.forEach(player => {
            gameState.transferMarket.available.push({
                ...player,
                currentTeam: team.key,
                currentTeamName: team.name,
                price: calculatePlayerValue({ ...player, fame: 50, condition: 85, fatigue: 20 })
            });
        });
    });
}

// 게임 초기화 (수정)
function initializeGame() {
    // 기본 상태로 리셋
    gameState = {
        player: null,
        currentWeek: 1,
        currentSeason: 1,
        currentYear: 2024,
        league: {
            teams: [],
            standings: [],
            fixtures: [],
            results: [],
            topScorers: [],
            topAssists: []
        },
        nationalTeam: {
            eligible: false,
            competitions: [],
            callUps: []
        },
        transferMarket: {
            available: [],
            offers: []
        },
        events: [],
        settings: {
            autoSave: false,
            soundEffects: true
        }
    };
    
    // 슈퍼리그 초기화
    initializeSuperLeague();
    initializeTransferMarket();
}

// 저장/불러오기 함수들 (로컬스토리지 제거)
function saveGameState() {
    // 로컬스토리지 사용 안함 - 변수에만 저장
    console.log('게임 상태가 메모리에 저장되었습니다.');
    return true;
}

function loadGameState() {
    // 게임 시작 시 초기화만 수행
    return false;
}

// JSON 파일로 내보내기 (유지)
function exportGameToFile() {
    const dataStr = JSON.stringify(gameState, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `슈퍼리그_${gameState.player.name}_시즌${gameState.currentSeason}.json`;
    link.click();
}

// JSON 파일에서 가져오기 (유지)
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

// 자동 저장 (비활성화)
function autoSave() {
    // 아무것도 하지 않음
}

// 다음 주로 이동 (슈퍼리그 시뮬레이션 추가)
function advanceWeek() {
    gameState.currentWeek++;
    
    // 리그 경기 시뮬레이션
    simulateLeagueMatches(gameState.currentWeek - 1);
    
    // 시즌 변경 체크
    if (gameState.currentWeek > 34) {
        gameState.currentWeek = 1;
        gameState.currentSeason++;
        gameState.currentYear++;
        
        // 선수 나이 증가
        if (gameState.player) {
            gameState.player.age++;
        }
        
        // 시즌 종료 이벤트 생성
        generateSeasonEndEvent();
        
        // 새 시즌 초기화
        initializeSuperLeague();
        initializeTransferMarket();
    }
    
    // 국가대표 대회 체크
    const competition = checkNationalCompetitions(gameState.currentYear, gameState.currentWeek);
    if (competition && checkNationalTeamEligibility(gameState.player)) {
        generateNationalTeamCallUp(competition);
    }
    
    // 주간 이벤트 생성
    generateWeeklyEvents();
}

// 국가대표 소집 이벤트
function generateNationalTeamCallUp(competition) {
    const player = gameState.player;
    const nationality = playerNationalities[player.name] || player.customNationality || 'KOR';
    
    generateNationalTeamEvent(competition, nationality);
}

// 게임 상태 검증
function validateGameState() {
    if (!gameState.player) {
        console.error('플레이어 데이터가 없습니다.');
        return false;
    }
    
    if (gameState.currentWeek < 1 || gameState.currentWeek > 34) {
        console.error('잘못된 주차 데이터입니다.');
        return false;
    }
    
    return true;
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
