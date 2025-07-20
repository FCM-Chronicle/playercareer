// 국가대표 이벤트 생성
function generateNationalTeamEvent(competition, nationality) {
    const countryNames = {
        'KOR': '대한민국',
        'JPN': '일본', 
        'BRA': '브라질',
        'ARG': '아르헨티나',
        'FRA': '프랑스',
        'ENG': '잉글랜드',
        'GER': '독일',
        'EGY': '이집트'
    };
    
    const countryName = countryNames[nationality] || '국가대표팀';
    
    showEvent('🏆 국가대표 소집', 
        `${countryName} 국가대표팀에서 ${competition.name}을(를) 위해 당신을 소집했습니다! 이는 선수로서 최고의 영예입니다.`,
        [
            {
                text: '영광스럽게 참가하겠습니다!',
                effect: () => {
                    updatePlayerMorale(player, -3);
                    updatePlayerFame(player, +2); // 충성도 보상
                }
            }
        ]
    );
}

// 리그 정보 표시 함수
function showLeagueStandings() {
    updateStandings();
    const standings = gameState.league.standings.slice(0, 10); // 상위 10팀
    
    let standingsText = '🏆 슈퍼리그 순위표 (상위 10팀)\n\n';
    standings.forEach((team, index) => {
        const gd = team.goalsFor - team.goalsAgainst;
        standingsText += `${index + 1}. ${team.name} - ${team.points}점 (${team.wins}승 ${team.draws}무 ${team.losses}패, 득실차 ${gd > 0 ? '+' : ''}${gd})\n`;
    });
    
    showEvent('📊 리그 현황', standingsText, [
        {
            text: '득점왕 보기',
            effect: () => showTopScorers()
        },
        {
            text: '도움왕 보기', 
            effect: () => showTopAssists()
        },
        {
            text: '닫기',
            effect: () => {}
        }
    ]);
}

// 득점왕 표시
function showTopScorers() {
    const topScorers = gameState.league.topScorers.slice(0, 10);
    
    let scorersText = '⚽ 득점왕 순위 (상위 10명)\n\n';
    topScorers.forEach((scorer, index) => {
        const flag = getFlagEmoji(scorer.nationality);
        scorersText += `${index + 1}. ${scorer.name} (${scorer.team}) ${flag} - ${scorer.goals}골\n`;
    });
    
    showEvent('⚽ 득점왕', scorersText, [
        {
            text: '확인',
            effect: () => {}
        }
    ]);
}

// 도움왕 표시
function showTopAssists() {
    const topAssists = gameState.league.topAssists.slice(0, 10);
    
    let assistsText = '🅰️ 도움왕 순위 (상위 10명)\n\n';
    topAssists.forEach((assist, index) => {
        const flag = getFlagEmoji(assist.nationality);
        assistsText += `${index + 1}. ${assist.name} (${assist.team}) ${flag} - ${assist.assists}도움\n`;
    });
    
    showEvent('🅰️ 도움왕', assistsText, [
        {
            text: '확인',
            effect: () => {}
        }
    ]);
}

// 국기 이모지 매핑
function getFlagEmoji(nationality) {
    const flags = {
        'KOR': '🇰🇷',
        'JPN': '🇯🇵', 
        'BRA': '🇧🇷',
        'ARG': '🇦🇷',
        'FRA': '🇫🇷',
        'ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        'GER': '🇩🇪',
        'EGY': '🇪🇬',
        'OTHER': '🌍'
    };
    return flags[nationality] || '🌍';
}

// 이적 시장 표시
function showTransferMarket() {
    const availablePlayers = gameState.transferMarket.available.slice(0, 15);
    
    let marketText = '💰 이적 시장 (상위 15명)\n\n';
    availablePlayers.forEach((player, index) => {
        marketText += `${index + 1}. ${player.name} (${player.currentTeamName}) - 레이팅 ${player.rating}, ₩${player.price.toLocaleString()}\n`;
    });
    
    showEvent('💰 이적 시장', marketText, [
        {
            text: '선수 영입 시도',
            effect: () => attemptTransfer()
        },
        {
            text: '닫기',
            effect: () => {}
        }
    ]);
}

// 이적 시도
function attemptTransfer() {
    // 간단한 이적 시스템 - 무작위로 성공/실패
    const player = gameState.player;
    
    if (Math.random() < 0.3) { // 30% 성공률
        generateTransferOfferEvent();
    } else {
        showEvent('📞 이적 실패', 
            '아직 다른 팀에서 당신에게 관심을 보이지 않고 있습니다. 더 좋은 성과를 내서 관심을 끌어보세요!',
            [{
                text: '더 열심히 하겠습니다',
                effect: () => updatePlayerMorale(player, +3)
            }]
        );
    }
}

// JSON/텍스트 저장 시스템
function saveGameToText() {
    const gameData = {
        player: gameState.player,
        currentWeek: gameState.currentWeek,
        currentSeason: gameState.currentSeason,
        currentYear: gameState.currentYear,
        league: gameState.league,
        nationalTeam: gameState.nationalTeam,
        transferMarket: gameState.transferMarket
    };
    
    const saveText = JSON.stringify(gameData, null, 2);
    
    // 텍스트 에리어에 표시
    showSaveModal(saveText);
}

// 저장 모달 표시
function showSaveModal(saveText) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <h3>💾 게임 저장</h3>
            <p>아래 텍스트를 복사해서 저장하거나, JSON 파일로 다운로드하세요:</p>
            <textarea readonly style="width: 100%; height: 200px; margin: 15px 0; font-family: monospace; font-size: 12px;">${saveText}</textarea>
            <div style="text-align: center;">
                <button class="btn btn-primary" onclick="copyToClipboard('${btoa(saveText)}')">📋 클립보드 복사</button>
                <button class="btn btn-secondary" onclick="downloadJSON('${btoa(saveText)}')">📁 JSON 다운로드</button>
                <button class="btn" onclick="closeSaveModal()">닫기</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentSaveModal = modal;
}

// 클립보드 복사
function copyToClipboard(encodedText) {
    const text = atob(encodedText);
    navigator.clipboard.writeText(text).then(() => {
        alert('클립보드에 복사되었습니다!');
    }).catch(() => {
        alert('복사에 실패했습니다. 수동으로 복사해주세요.');
    });
}

// JSON 다운로드
function downloadJSON(encodedText) {
    const text = atob(encodedText);
    const dataBlob = new Blob([text], {type: 'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `슈퍼리그_${gameState.player.name}_시즌${gameState.currentSeason}_${gameState.currentWeek}주차.json`;
    link.click();
}

// 저장 모달 닫기
function closeSaveModal() {
    if (window.currentSaveModal) {
        document.body.removeChild(window.currentSaveModal);
        window.currentSaveModal = null;
    }
}

// 불러오기 모달 표시
function showLoadModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <h3>📂 게임 불러오기</h3>
            <p>저장된 텍스트를 붙여넣거나 JSON 파일을 선택하세요:</p>
            <textarea id="loadTextArea" placeholder="저장된 게임 데이터를 여기에 붙여넣으세요..." style="width: 100%; height: 150px; margin: 15px 0; font-family: monospace; font-size: 12px;"></textarea>
            <input type="file" id="loadFileInput2" accept=".json" style="margin: 10px 0;">
            <div style="text-align: center;">
                <button class="btn btn-primary" onclick="loadFromText()">📋 텍스트에서 불러오기</button>
                <button class="btn btn-secondary" onclick="loadFromFile()">📁 파일에서 불러오기</button>
                <button class="btn" onclick="closeLoadModal()">닫기</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentLoadModal = modal;
    
    // 파일 입력 이벤트
    document.getElementById('loadFileInput2').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('loadTextArea').value = e.target.result;
            };
            reader.readAsText(file);
        }
    });
}

// 텍스트에서 불러오기
function loadFromText() {
    const text = document.getElementById('loadTextArea').value.trim();
    if (!text) {
        alert('불러올 데이터를 입력해주세요.');
        return;
    }
    
    try {
        const gameData = JSON.parse(text);
        
        // 게임 상태 복원
        gameState.player = gameData.player;
        gameState.currentWeek = gameData.currentWeek;
        gameState.currentSeason = gameData.currentSeason;
        gameState.currentYear = gameData.currentYear;
        gameState.league = gameData.league;
        gameState.nationalTeam = gameData.nationalTeam;
        gameState.transferMarket = gameData.transferMarket;
        
        closeLoadModal();
        showGameScreen();
        alert('게임을 성공적으로 불러왔습니다!');
        
    } catch (error) {
        alert('잘못된 데이터 형식입니다. 올바른 저장 데이터를 입력해주세요.');
        console.error('로드 오류:', error);
    }
}

// 파일에서 불러오기
function loadFromFile() {
    loadFromText(); // 텍스트 영역의 내용으로 불러오기
}

// 불러오기 모달 닫기
function closeLoadModal() {
    if (window.currentLoadModal) {
        document.body.removeChild(window.currentLoadModal);
        window.currentLoadModal = null;
    }
}

// 기존 saveGame과 loadGame 함수 수정
function saveGame() {
    saveGameToText();
}

function loadGame() {
    showLoadModal();
}Fame(gameState.player, +15);
                    updatePlayerMorale(gameState.player, +20);
                    gameState.nationalTeam.callUps.push({
                        year: gameState.currentYear,
                        competition: competition.name,
                        type: competition.type
                    });
                    
                    // 국가대표 경기 시뮬레이션
                    simulateNationalTeamMatches(competition, nationality);
                }
            },
            {
                text: '부상 위험으로 거절',
                effect: () => {
                    updatePlayerMorale(gameState.player, -10);
                    updatePlayerFame(gameState.player, -5);
                }
            }
        ]
    );
}

// 국가대표 경기 시뮬레이션
function simulateNationalTeamMatches(competition, nationality) {
    const matches = Math.floor(Math.random() * 3) + 2; // 2-4경기
    let totalGoals = 0;
    let totalAssists = 0;
    
    for (let i = 0; i < matches; i++) {
        const goals = Math.random() < 0.3 ? 1 : 0;
        const assists = Math.random() < 0.2 ? 1 : 0;
        totalGoals += goals;
        totalAssists += assists;
    }
    
    // 성과에 따른 보상
    const performance = totalGoals + totalAssists;
    let message = `${competition.name}에서 ${matches}경기를 치뤘습니다.\n`;
    message += `개인 성과: ${totalGoals}골 ${totalAssists}도움\n`;
    
    if (performance >= 3) {
        message += '환상적인 활약으로 팀의 영웅이 되었습니다!';
        updatePlayerFame(gameState.player, +10);
        updatePlayerMorale(gameState.player, +15);
    } else if (performance >= 1) {
        message += '준수한 활약을 보여주었습니다.';
        updatePlayerFame(gameState.player, +5);
        updatePlayerMorale(gameState.player, +5);
    } else {
        message += '아쉬운 성과였지만 귀중한 경험이었습니다.';
        updatePlayerMorale(gameState.player, +3);
    }
    
    // 국가대표 경험으로 피로도 증가
    updatePlayerFatigue(gameState.player, +20);
    
    showEvent('🇰🇷 국가대표 활동 결과', message, [
        {
            text: '다음에 더 잘하겠습니다!',
            effect: () => {
                updatePlayerForm(gameState.player, +5);
            }
        }
    ]);
}

// 이적 제안 이벤트 생성
function generateTransferOfferEvent() {
    const player = gameState.player;
    const availableTeams = superLeagueTeams.filter(team => teamNames[team] !== player.team);
    
    if (availableTeams.length === 0) return;
    
    const interestedTeam = availableTeams[Math.floor(Math.random() * availableTeams.length)];
    const teamName = teamNames[interestedTeam];
    const currentValue = calculatePlayerValue(player);
    const offerSalary = player.salary * (1.2 + Math.random() * 0.5); // 20-70% 인상
    
    showEvent('📞 이적 제안', 
        `${teamName}에서 당신에게 관심을 보이고 있습니다! 주급 ₩${Math.floor(offerSalary).toLocaleString()}을 제안했습니다.`,
        [
            {
                text: '이적하겠습니다!',
                effect: () => {
                    // 현재 팀에서 제거
                    const currentTeam = gameState.league.teams.find(t => t.name === player.team);
                    if (currentTeam) {
                        const playerIndex = currentTeam.players.findIndex(p => p.name === player.name);
                        if (playerIndex !== -1) {
                            currentTeam.players.splice(playerIndex, 1);
                        }
                    }
                    
                    // 새 팀으로 이적
                    const newTeam = gameState.league.teams.find(t => t.key === interestedTeam);
                    if (newTeam) {
                        newTeam.players.push({
                            name: player.name,
                            position: player.position,
                            rating: calculateOverallRating(player),
                            age: player.age
                        });
                    }
                    
                    // 플레이어 정보 업데이트
                    transferPlayer(player, teamName, Math.floor(offerSalary));
                    updatePlayerFame(player, +5);
                    updatePlayerMorale(player, +10);
                }
            },
            {
                text: '현재 팀에 잔류',
                effect: () => {
                    updatePlayer// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('게임 초기화 시작...');
    
    try {
        initializeGame();
        console.log('게임 초기화 완료');
        showStartScreen();
    } catch (error) {
        console.error('초기화 오류:', error);
        alert('게임 초기화 중 오류가 발생했습니다: ' + error.message);
    }
    
    // 훈련 선택 변경 이벤트 리스너
    setupTrainingListeners();
});

// 훈련 관련 이벤트 리스너 설정
function setupTrainingListeners() {
    const trainingSelects = ['physicalTraining', 'technicalTraining', 'mentalTraining'];
    
    trainingSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.addEventListener('change', updateTrainingPreview);
        }
    });
}

// 훈련 미리보기 업데이트 (기본 함수)
function updateTrainingPreview() {
    try {
        const physicalIntensity = parseInt(document.getElementById('physicalTraining')?.value || 0);
        const technicalIntensity = parseInt(document.getElementById('technicalTraining')?.value || 0);
        const mentalIntensity = parseInt(document.getElementById('mentalTraining')?.value || 0);
        
        const totalIntensity = physicalIntensity + technicalIntensity + mentalIntensity;
        
        // 피로도 예상치
        let fatiguePreview = '';
        if (totalIntensity <= 3) fatiguePreview = '낮음';
        else if (totalIntensity <= 6) fatiguePreview = '보통';
        else fatiguePreview = '높음';
        
        const fatigueEl = document.getElementById('fatiguePreview');
        if (fatigueEl) fatigueEl.textContent = fatiguePreview;
        
        // 각 훈련별 미리보기
        const intensityText = ['휴식', '가벼움', '보통', '강함'];
        
        const physicalPreviewEl = document.getElementById('physicalPreview');
        const technicalPreviewEl = document.getElementById('technicalPreview');
        const mentalPreviewEl = document.getElementById('mentalPreview');
        
        if (physicalPreviewEl) physicalPreviewEl.textContent = intensityText[physicalIntensity];
        if (technicalPreviewEl) technicalPreviewEl.textContent = intensityText[technicalIntensity];
        if (mentalPreviewEl) mentalPreviewEl.textContent = intensityText[mentalIntensity];
    } catch (error) {
        console.error('훈련 미리보기 업데이트 오류:', error);
    }
}

// 주간 이벤트 생성 (기본 함수)
function generateWeeklyEvents() {
    // 기본 주간 이벤트 로직
    const week = gameState.currentWeek;
    
    if (week === 1) {
        console.log('새 시즌 시작');
    } else if (week === 17) {
        console.log('시즌 중반');
    } else if (week === 34) {
        console.log('시즌 마지막');
    }
    
    // 이적 제안 (낮은 확률)
    if (Math.random() < 0.05 && gameState.player) { // 5% 확률
        setTimeout(() => generateTransferOfferEvent(), 1000);
    }
}

// 시즌 종료 이벤트 생성 (기본 함수)
function generateSeasonEndEvent() {
    if (!gameState.player) return;
    
    const player = gameState.player;
    
    setTimeout(() => {
        showEvent('🏆 시즌 종료', 
            `시즌 ${gameState.currentSeason - 1}이 끝났습니다! 한 해 동안 수고하셨습니다. 새로운 시즌을 맞아 목표를 새롭게 설정해보세요.`,
            [{
                text: '다음 시즌 준비하기',
                effect: () => {
                    updatePlayerMorale(player, +10);
                    updatePlayerCondition(player, +20);
                    updatePlayerFatigue(player, -30);
                }
            }]
        );
    }, 500);
}

// 새 게임 시작 함수들
function startWithSelectedPlayer() {
    console.log('실제 선수로 게임 시작 시도...');
    
    if (!selectedPlayer) {
        alert('선수를 선택해주세요.');
        return;
    }
    
    try {
        // 실제 선수로 게임 시작
        console.log('선택된 선수:', selectedPlayer);
        gameState.player = createRealPlayerData(selectedPlayer);
        console.log('플레이어 생성 완료:', gameState.player);
        
        showGameScreen();
        
        // 시작 이벤트 생성
        showWelcomeEvent();
        
        console.log('게임 시작 완료');
    } catch (error) {
        console.error('실제 선수 게임 시작 오류:', error);
        alert('게임 시작 중 오류가 발생했습니다: ' + error.message);
    }
}

function createNewPlayer() {
    console.log('새 선수 생성 시도...');
    
    const name = document.getElementById('playerName').value.trim();
    const position = document.getElementById('playerPosition').value;
    const age = document.getElementById('playerAge').value;
    const nationality = document.getElementById('playerNationality').value;
    const background = document.getElementById('playerBackground').value;
    
    console.log('입력값:', { name, position, age, nationality, background });
    
    if (!name) {
        alert('선수 이름을 입력해주세요.');
        return;
    }
    
    try {
        // 새 선수 생성
        gameState.player = createNewPlayerData(name, position, age, background);
        gameState.player.customNationality = nationality; // 사용자 선택 국적 저장
        
        console.log('새 선수 생성 완료:', gameState.player);
        
        showGameScreen();
        
        // 시작 이벤트 생성
        showWelcomeEvent();
        
        console.log('새 선수 게임 시작 완료');
    } catch (error) {
        console.error('새 선수 생성 오류:', error);
        alert('선수 생성 중 오류가 발생했습니다: ' + error.message);
    }
}

function closeLoadModal() {
    if (window.currentLoadModal) {
        document.body.removeChild(window.currentLoadModal);
        window.currentLoadModal = null;
    }
}

// 환영 이벤트 표시
function showWelcomeEvent() {
    console.log('환영 이벤트 시작');
    
    const player = gameState.player;
    if (!player) {
        console.error('플레이어 데이터가 없습니다');
        return;
    }
    
    const isRealPlayer = player.isRealPlayer;
    
    let eventText = '';
    if (isRealPlayer) {
        eventText = `${player.name}으로 새로운 축구 인생이 시작됩니다! 현재 ${player.team}에서 뛰고 있으며, 많은 팬들의 기대를 받고 있습니다. 꾸준한 훈련과 좋은 경기력으로 더 높은 곳을 향해 나아가세요!`;
    } else {
        const bgText = backgroundModifiers[player.background].description;
        eventText = `${player.name}, 축구의 세계에 오신 것을 환영합니다! ${bgText}를 가진 당신의 축구 인생이 지금 시작됩니다. ${player.team}에서 첫 발걸음을 내딛으며, 언젠가는 세계 최고의 선수가 되는 꿈을 이루어 나가세요!`;
    }
    
    setTimeout(() => {
        showEvent('🎉 새로운 시작', eventText, [
            {
                text: '열심히 하겠습니다!',
                effect: () => {
                    updatePlayerMorale(player, +10);
                    updateDashboard();
                }
            }
        ]);
    }, 500);
}

// 누락된 경기 관련 함수들
function simulateMatch() {
    const player = gameState.player;
    
    const currentFixtures = gameState.league.fixtures[gameState.currentWeek - 1];
    const playerTeamKey = Object.keys(teamNames).find(key => teamNames[key] === player.team);
    const playerMatch = currentFixtures ? currentFixtures.find(fixture => 
        fixture.home === playerTeamKey || fixture.away === playerTeamKey
    ) : null;
    
    if (!playerMatch) {
        addMatchEvent('이번 주는 경기가 없습니다.');
        return;
    }
    
    const isHome = playerMatch.home === playerTeamKey;
    const opponent = isHome ? playerMatch.awayName : playerMatch.homeName;
    const venue = isHome ? '홈' : '어웨이';
    
    const matchEvents = [
        `⚽ 경기 시작! ${player.team} vs ${opponent} (${venue})`,
        `${player.name}이(가) 킥오프에 참여합니다.`,
        '팀이 공격을 시도합니다.',
        `${player.name}의 움직임이 돋보입니다!`,
        `${opponent}의 반격이 이어집니다.`,
        `${player.name}이(가) 수비에 가담합니다.`,
        '전반 30분이 지났습니다.',
        '양 팀 모두 치열하게 경합하고 있습니다.',
        '전반전 종료!',
        '하프타임입니다.',
        '후반전 시작!',
        `${player.name}의 적극적인 플레이!`,
        '결정적인 순간이 다가옵니다.',
        `${opponent}과의 치열한 경합이 계속됩니다.`,
        '경기가 막바지로 향하고 있습니다.',
        '추가시간 없이 경기 종료!'
    ];
    
    let eventIndex = 0;
    const eventInterval = setInterval(() => {
        if (eventIndex < matchEvents.length) {
            addMatchEvent(matchEvents[eventIndex]);
            
            if (eventIndex === 7 && Math.random() < 0.3) {
                addMatchEvent(`⚽ 골! ${player.name}이(가) 환상적인 골을 기록했습니다!`);
            } else if (eventIndex === 11 && Math.random() < 0.2) {
                addMatchEvent(`🅰️ ${player.name}의 완벽한 어시스트!`);
            }
            
            eventIndex++;
        } else {
            clearInterval(eventInterval);
            finishMatch();
        }
    }, 800);
}

function addMatchEvent(eventText) {
    const matchLog = document.getElementById('matchLog');
    const eventDiv = document.createElement('div');
    eventDiv.style.marginBottom = '5px';
    eventDiv.textContent = `${new Date().toLocaleTimeString()} - ${eventText}`;
    matchLog.appendChild(eventDiv);
    matchLog.scrollTop = matchLog.scrollHeight;
}

function finishMatch() {
    const player = gameState.player;
    const matchStats = generateMatchStats(player);
    
    updatePlayerStats(player, matchStats);
    
    updatePlayerCondition(player, -10);
    updatePlayerFatigue(player, +15);
    updatePlayerForm(player, matchStats.rating >= 7.0 ? +5 : -2);
    
    if (matchStats.rating >= 8.0) {
        updatePlayerFame(player, +2);
    } else if (matchStats.rating < 6.0) {
        updatePlayerFame(player, -1);
    }
    
    player.playedMatchThisWeek = true;
    
    const matchBtn = document.getElementById('startMatchBtn');
    if (matchBtn) {
        matchBtn.disabled = true;
        matchBtn.textContent = '이번 주 경기 완료';
    }
    
    showMatchResult(matchStats);
    updateDashboard();
}

function generateMatchStats(player) {
    const baseRating = calculateMatchRating(player);
    const goals = player.position === 'FW' && Math.random() < 0.3 ? 1 : 0;
    const assists = Math.random() < 0.2 ? 1 : 0;
    const yellowCards = Math.random() < 0.1 ? 1 : 0;
    const redCards = Math.random() < 0.02 ? 1 : 0;
    
    return {
        rating: baseRating,
        goals: goals,
        assists: assists,
        yellowCards: yellowCards,
        redCards: redCards,
        passes: Math.floor(Math.random() * 30) + 20,
        tackles: player.position === 'DF' ? Math.floor(Math.random() * 8) + 2 : Math.floor(Math.random() * 3),
        shots: player.position === 'FW' ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 2)
    };
}

function calculateMatchRating(player) {
    const overallRating = calculateOverallRating(player);
    const conditionFactor = player.condition / 100;
    const fatigueFactor = Math.max(0.7, (100 - player.fatigue) / 100);
    const formFactor = player.form / 100;
    
    const baseRating = (overallRating / 100) * 4 + 5;
    const finalRating = baseRating * conditionFactor * fatigueFactor * formFactor;
    
    const randomFactor = (Math.random() - 0.5) * 1.0;
    
    return Math.max(4.0, Math.min(10.0, finalRating + randomFactor));
}

function showMatchResult(matchStats) {
    const teamScore = Math.floor(Math.random() * 4);
    const opponentScore = Math.floor(Math.random() * 3);
    
    let result = '';
    if (teamScore > opponentScore) result = '승리 🎉';
    else if (teamScore < opponentScore) result = '패배 😔';
    else result = '무승부 🤝';
    
    const resultText = `
        <strong>경기 결과: ${teamScore} : ${opponentScore} (${result})</strong><br><br>
        <strong>개인 성과:</strong><br>
        • 평점: ${matchStats.rating.toFixed(1)}/10<br>
        • 골: ${matchStats.goals}개<br>
        • 어시스트: ${matchStats.assists}개<br>
        • 패스: ${matchStats.passes}개<br>
        • 태클: ${matchStats.tackles}개<br>
        • 슈팅: ${matchStats.shots}개<br>
        ${matchStats.yellowCards > 0 ? `• 경고: ${matchStats.yellowCards}개<br>` : ''}
        ${matchStats.redCards > 0 ? `• 퇴장: ${matchStats.redCards}개<br>` : ''}
    `;
    
    document.getElementById('matchResultText').innerHTML = resultText;
    document.getElementById('matchResult').classList.remove('hidden');
}

// 추가 누락 함수들
function checkRandomEvents() {
    if (Math.random() < 0.2) {
        generateRandomEvent();
    }
}

function handleInjuryWeek() {
    const player = gameState.player;
    
    showEvent('🏥 부상 치료', 
        `부상 치료에 집중했습니다. 컨디션이 조금 회복되었습니다.`, 
        [{
            text: '계속 치료하기',
            effect: () => {
                updatePlayerCondition(player, +5);
                updatePlayerMorale(player, +2);
                advanceWeek();
                updateDashboard();
            }
        }]
    );
}

function showTopScorers() {
    const topScorers = gameState.league.topScorers.slice(0, 10);
    
    let scorersText = '⚽ 득점왕 순위 (상위 10명)\n\n';
    topScorers.forEach((scorer, index) => {
        const flag = getFlagEmoji(scorer.nationality);
        scorersText += `${index + 1}. ${scorer.name} (${scorer.team}) ${flag} - ${scorer.goals}골\n`;
    });
    
    showEvent('⚽ 득점왕', scorersText, [
        {
            text: '확인',
            effect: () => {}
        }
    ]);
}

function showTopAssists() {
    const topAssists = gameState.league.topAssists.slice(0, 10);
    
    let assistsText = '🅰️ 도움왕 순위 (상위 10명)\n\n';
    topAssists.forEach((assist, index) => {
        const flag = getFlagEmoji(assist.nationality);
        assistsText += `${index + 1}. ${assist.name} (${assist.team}) ${flag} - ${assist.assists}도움\n`;
    });
    
    showEvent('🅰️ 도움왕', assistsText, [
        {
            text: '확인',
            effect: () => {}
        }
    ]);
}

function getFlagEmoji(nationality) {
    const flags = {
        'KOR': '🇰🇷',
        'JPN': '🇯🇵', 
        'BRA': '🇧🇷',
        'ARG': '🇦🇷',
        'FRA': '🇫🇷',
        'ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        'GER': '🇩🇪',
        'EGY': '🇪🇬',
        'OTHER': '🌍'
    };
    return flags[nationality] || '🌍';
}

function attemptTransfer() {
    const player = gameState.player;
    
    if (Math.random() < 0.3) {
        generateTransferOfferEvent();
    } else {
        showEvent('📞 이적 실패', 
            '아직 다른 팀에서 당신에게 관심을 보이지 않고 있습니다. 더 좋은 성과를 내서 관심을 끌어보세요!',
            [{
                text: '더 열심히 하겠습니다',
                effect: () => updatePlayerMorale(player, +3)
            }]
        );
    }
}

// 게임 저장/불러오기
function saveGame() {
    const hideLoading = showLoading(event.currentTarget);
    
    setTimeout(() => {
        const success = saveGameState();
        hideLoading();
        
        if (success) {
            showSuccessEffect(event.currentTarget);
            alert('게임이 저장되었습니다!');
            
            // JSON 파일로도 내보내기
            exportGameToFile();
        } else {
            showFailureEffect(event.currentTarget);
            alert('게임 저장에 실패했습니다.');
        }
    }, 500);
}

function loadGame() {
    document.getElementById('loadFileInput').click();
}

function handleFileLoad(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const hideLoading = showLoading(document.querySelector('.btn'));
    
    importGameFromFile(file)
        .then(() => {
            hideLoading();
            showGameScreen();
            alert('게임을 성공적으로 불러왔습니다!');
        })
        .catch((error) => {
            hideLoading();
            console.error('파일 로드 실패:', error);
            alert('게임 파일 불러오기에 실패했습니다.');
        });
}

// 다음 주로 이동
function nextWeek() {
    const player = gameState.player;
    
    // 부상 중이면 자동 휴식
    if (isPlayerInjured(player)) {
        handleInjuryWeek();
        return;
    }
    
    // 주간 자연적 변화 적용
    applyWeeklyChanges(player);
    
    // 다음 주로 이동
    advanceWeek();
    
    // 훈련 상태 초기화
    player.trainedThisWeek = false;
    player.playedMatchThisWeek = false;
    
    // 훈련 버튼 다시 활성화
    const trainBtn = document.querySelector('#trainingSection .btn-primary');
    if (trainBtn) {
        trainBtn.disabled = false;
        trainBtn.textContent = '훈련 시작';
    }
    
    // 경기 버튼 다시 활성화
    const matchBtn = document.getElementById('startMatchBtn');
    if (matchBtn && !isPlayerInjured(player)) {
        matchBtn.disabled = false;
        matchBtn.textContent = '경기 시작';
    }
    
    // 훈련 결과 숨기기
    document.getElementById('trainingResult').classList.add('hidden');
    document.getElementById('matchResult').classList.add('hidden');
    
    // UI 업데이트
    updateDashboard();
    
    // 무작위 이벤트 발생 체크
    checkRandomEvents();
}

// 부상 중 주차 처리
function handleInjuryWeek() {
    const player = gameState.player;
    
    showEvent('🏥 부상 치료', 
        `부상 치료에 집중했습니다. 컨디션이 조금 회복되었습니다.`, 
        [{
            text: '계속 치료하기',
            effect: () => {
                updatePlayerCondition(player, +5);
                updatePlayerMorale(player, +2);
                advanceWeek();
                updateDashboard();
            }
        }]
    );
}

// 무작위 이벤트 체크
function checkRandomEvents() {
    // 20% 확률로 이벤트 발생
    if (Math.random() < 0.2) {
        generateRandomEvent();
    }
}

// 무작위 이벤트 생성
function generateRandomEvent() {
    const player = gameState.player;
    const events = [
        {
            title: '📰 언론 인터뷰',
            text: '기자가 인터뷰를 요청했습니다. 어떻게 대응하시겠습니까?',
            choices: [
                {
                    text: '적극적으로 응답',
                    effect: () => {
                        updatePlayerFame(player, +3);
                        updatePlayerMorale(player, +5);
                    }
                },
                {
                    text: '간단히 답변',
                    effect: () => {
                        updatePlayerFame(player, +1);
                    }
                },
                {
                    text: '인터뷰 거절',
                    effect: () => {
                        updatePlayerMorale(player, +3);
                        updatePlayerFame(player, -1);
                    }
                }
            ]
        },
        {
            title: '🎯 개인 훈련 제안',
            text: '개인 트레이너가 특별 훈련을 제안했습니다.',
            choices: [
                {
                    text: '수락하기',
                    effect: () => {
                        const improvement = Math.floor(Math.random() * 3) + 1;
                        improvePlayerRating(player, improvement);
                        updatePlayerFatigue(player, +10);
                    }
                },
                {
                    text: '거절하기',
                    effect: () => {
                        updatePlayerMorale(player, -2);
                    }
                }
            ]
        },
        {
            title: '🏆 팀 내 경쟁',
            text: '팀 동료와의 경쟁이 치열해지고 있습니다.',
            choices: [
                {
                    text: '더 열심히 훈련',
                    effect: () => {
                        updatePlayerForm(player, +5);
                        updatePlayerFatigue(player, +5);
                    }
                },
                {
                    text: '현재 수준 유지',
                    effect: () => {
                        // 변화 없음
                    }
                },
                {
                    text: '동료와 협력',
                    effect: () => {
                        updatePlayerMorale(player, +5);
                        updatePlayerFame(player, +2);
                    }
                }
            ]
        }
    ];
    
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    showEvent(randomEvent.title, randomEvent.text, randomEvent.choices);
}

// 이벤트 표시
function showEvent(title, text, choices) {
    document.getElementById('eventTitle').textContent = title;
    document.getElementById('eventText').textContent = text;
    
    const choicesDiv = document.getElementById('eventChoices');
    choicesDiv.innerHTML = '';
    
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'btn';
        button.textContent = choice.text;
        button.onclick = () => {
            choice.effect();
            hideModal('eventModal');
            updateDashboard();
            autoSave();
        };
        choicesDiv.appendChild(button);
    });
    
    showModal('eventModal');
}

// 훈련 미리보기 업데이트
function updateTrainingPreview() {
    const physicalIntensity = parseInt(document.getElementById('physicalTraining').value);
    const technicalIntensity = parseInt(document.getElementById('technicalTraining').value);
    const mentalIntensity = parseInt(document.getElementById('mentalTraining').value);
    
    const totalIntensity = physicalIntensity + technicalIntensity + mentalIntensity;
    
    // 피로도 예상치
    let fatiguePreview = '';
    if (totalIntensity <= 3) fatiguePreview = '낮음';
    else if (totalIntensity <= 6) fatiguePreview = '보통';
    else fatiguePreview = '높음';
    
    document.getElementById('fatiguePreview').textContent = fatiguePreview;
    
    // 각 훈련별 미리보기
    const intensityText = ['휴식', '가벼움', '보통', '강함'];
    
    document.getElementById('physicalPreview').textContent = intensityText[physicalIntensity];
    document.getElementById('technicalPreview').textContent = intensityText[technicalIntensity];
    document.getElementById('mentalPreview').textContent = intensityText[mentalIntensity];
}

// 훈련 실행
function executeTraining() {
    const player = gameState.player;
    
    if (isPlayerInjured(player)) {
        alert('부상 중에는 훈련할 수 없습니다.');
        return;
    }
    
    // 이미 이번 주에 훈련했는지 체크
    if (player.trainedThisWeek) {
        alert('이번 주에 이미 훈련을 완료했습니다. 다음 주에 다시 훈련하세요.');
        return;
    }
    
    const physicalIntensity = parseInt(document.getElementById('physicalTraining').value);
    const technicalIntensity = parseInt(document.getElementById('technicalTraining').value);
    const mentalIntensity = parseInt(document.getElementById('mentalTraining').value);
    
    const results = [];
    let totalFatigueIncrease = 0;
    
    // 피지컬 훈련
    if (physicalIntensity > 0) {
        const improvement = calculateTrainingImprovement(physicalIntensity, player.rating, player.potential);
        if (improvement > 0) {
            improvePlayerRating(player, improvement);
            results.push(`💪 피지컬 향상: +${improvement}`);
        }
        totalFatigueIncrease += physicalIntensity * 3;
    }
    
    // 기술 훈련
    if (technicalIntensity > 0) {
        const improvement = calculateTrainingImprovement(technicalIntensity, player.rating, player.potential);
        if (improvement > 0) {
            improvePlayerRating(player, improvement);
            results.push(`⚽ 기술 향상: +${improvement}`);
        }
        totalFatigueIncrease += technicalIntensity * 3;
    }
    
    // 멘탈 훈련
    if (mentalIntensity > 0) {
        const moraleImprovement = mentalIntensity * 2;
        updatePlayerMorale(player, moraleImprovement);
        results.push(`🧠 멘탈 강화: +${moraleImprovement}`);
        totalFatigueIncrease += mentalIntensity * 2;
    }
    
    // 피로도 증가
    updatePlayerFatigue(player, totalFatigueIncrease);
    
    // 컨디션 변화
    const totalIntensity = physicalIntensity + technicalIntensity + mentalIntensity;
    if (totalIntensity === 0) {
        // 완전 휴식
        updatePlayerCondition(player, 15);
        updatePlayerFatigue(player, -20);
        results.push('😴 완전히 휴식했습니다. 컨디션이 크게 회복되었습니다.');
    } else if (totalIntensity <= 3) {
        updatePlayerCondition(player, 5);
    } else if (totalIntensity >= 7) {
        updatePlayerCondition(player, -5);
        results.push('⚠️ 과도한 훈련으로 컨디션이 약간 저하되었습니다.');
    }
    
    // 부상 위험 체크
    if (totalIntensity >= 8 && player.fatigue > 70) {
        const injuryChance = Math.random();
        if (injuryChance < 0.1) { // 10% 확률
            const injuryTypes = ['근육 경련', '발목 삠', '무릎 통증', '등 통증'];
            const injuryType = injuryTypes[Math.floor(Math.random() * injuryTypes.length)];
            const weeks = Math.floor(Math.random() * 3) + 1;
            
            injurePlayer(player, injuryType, weeks);
            results.push(`🚨 부상 발생: ${injuryType} (${weeks}주 치료 필요)`);
        }
    }
    
    // 특별 이벤트 (낮은 확률)
    if (Math.random() < 0.1) {
        const specialEvents = [
            { text: '🌟 훈련 중 새로운 기술을 깨우쳤습니다!', effect: () => updatePlayerForm(player, +10) },
            { text: '👥 동료들과의 훈련으로 팀워크가 향상되었습니다!', effect: () => updatePlayerMorale(player, +5) },
            { text: '🎯 완벽한 훈련으로 자신감이 상승했습니다!', effect: () => updatePlayerForm(player, +8) }
        ];
        
        const specialEvent = specialEvents[Math.floor(Math.random() * specialEvents.length)];
        results.push(specialEvent.text);
        specialEvent.effect();
    }
    
    // 결과 표시
    document.getElementById('trainingResultText').innerHTML = results.join('<br>');
    document.getElementById('trainingResult').classList.remove('hidden');
    
    // 이번 주 훈련 완료 표시
    player.trainedThisWeek = true;
    
    // 훈련 버튼 비활성화
    const trainBtn = document.querySelector('#trainingSection .btn-primary');
    if (trainBtn) {
        trainBtn.disabled = true;
        trainBtn.textContent = '이번 주 훈련 완료';
    }
    
    // UI 업데이트
    updateDashboard();
    autoSave();
}

// 훈련 향상도 계산
function calculateTrainingImprovement(intensity, currentRating, potential) {
    if (currentRating >= potential) return 0;
    
    const baseImprovement = intensity * 0.5;
    const potentialFactor = (potential - currentRating) / potential;
    const randomFactor = Math.random() * 0.5 + 0.75; // 0.75 ~ 1.25
    
    const improvement = baseImprovement * potentialFactor * randomFactor;
    return Math.round(improvement);
}

// 경기 시작
function startMatch() {
    const player = gameState.player;
    
    if (isPlayerInjured(player)) {
        alert('부상 중에는 경기에 참여할 수 없습니다.');
        return;
    }
    
    const hideLoading = showLoading(event.currentTarget);
    
    // 경기 로그 표시
    const matchLog = document.getElementById('matchLog');
    matchLog.classList.remove('hidden');
    matchLog.innerHTML = '';
    
    // 경기 시뮬레이션 시작
    setTimeout(() => {
        hideLoading();
        simulateMatch();
    }, 1000);
}

// 경기 시뮬레이션
function simulateMatch() {
    const player = gameState.player;
    
    // 현재 주차의 플레이어 팀 경기 찾기
    const currentFixtures = gameState.league.fixtures[gameState.currentWeek - 1];
    const playerTeamKey = Object.keys(teamNames).find(key => teamNames[key] === player.team);
    const playerMatch = currentFixtures.find(fixture => 
        fixture.home === playerTeamKey || fixture.away === playerTeamKey
    );
    
    if (!playerMatch) {
        addMatchEvent('이번 주는 경기가 없습니다.');
        return;
    }
    
    const isHome = playerMatch.home === playerTeamKey;
    const opponent = isHome ? playerMatch.awayName : playerMatch.homeName;
    const venue = isHome ? '홈' : '어웨이';
    
    const matchEvents = [
        `⚽ 경기 시작! ${player.team} vs ${opponent} (${venue})`,
        `${player.name}이(가) 킥오프에 참여합니다.`,
        '팀이 공격을 시도합니다.',
        `${player.name}의 움직임이 돋보입니다!`,
        `${opponent}의 반격이 이어집니다.`,
        `${player.name}이(가) 수비에 가담합니다.`,
        '전반 30분이 지났습니다.',
        '양 팀 모두 치열하게 경합하고 있습니다.',
        '전반전 종료!',
        '하프타임입니다.',
        '후반전 시작!',
        `${player.name}의 적극적인 플레이!`,
        '결정적인 순간이 다가옵니다.',
        `${opponent}과의 치열한 경합이 계속됩니다.`,
        '경기가 막바지로 향하고 있습니다.',
        '추가시간 없이 경기 종료!'
    ];
    
    let eventIndex = 0;
    const eventInterval = setInterval(() => {
        if (eventIndex < matchEvents.length) {
            addMatchEvent(matchEvents[eventIndex]);
            
            // 특별 이벤트 (골, 어시스트 등)
            if (eventIndex === 7 && Math.random() < 0.3) {
                addMatchEvent(`⚽ 골! ${player.name}이(가) 환상적인 골을 기록했습니다!`);
            } else if (eventIndex === 11 && Math.random() < 0.2) {
                addMatchEvent(`🅰️ ${player.name}의 완벽한 어시스트!`);
            }
            
            eventIndex++;
        } else {
            clearInterval(eventInterval);
            finishMatch();
        }
    }, 800);
}

// 경기 로그에 이벤트 추가
function addMatchEvent(eventText) {
    const matchLog = document.getElementById('matchLog');
    const eventDiv = document.createElement('div');
    eventDiv.style.marginBottom = '5px';
    eventDiv.textContent = `${new Date().toLocaleTimeString()} - ${eventText}`;
    matchLog.appendChild(eventDiv);
    matchLog.scrollTop = matchLog.scrollHeight;
}

// 경기 종료 처리
function finishMatch() {
    const player = gameState.player;
    const matchStats = generateMatchStats(player);
    
    // 선수 통계 업데이트
    updatePlayerStats(player, matchStats);
    
    // 경기 후 변화
    updatePlayerCondition(player, -10);
    updatePlayerFatigue(player, +15);
    updatePlayerForm(player, matchStats.rating >= 7.0 ? +5 : -2);
    
    if (matchStats.rating >= 8.0) {
        updatePlayerFame(player, +2);
    } else if (matchStats.rating < 6.0) {
        updatePlayerFame(player, -1);
    }
    
    // 이번 주 경기 완료 표시
    player.playedMatchThisWeek = true;
    
    // 경기 버튼 비활성화
    const matchBtn = document.getElementById('startMatchBtn');
    if (matchBtn) {
        matchBtn.disabled = true;
        matchBtn.textContent = '이번 주 경기 완료';
    }
    
    // 결과 표시
    showMatchResult(matchStats);
    
    // UI 업데이트
    updateDashboard();
    autoSave();
}

// 경기 통계 생성
function generateMatchStats(player) {
    const baseRating = calculateMatchRating(player);
    const goals = player.position === 'FW' && Math.random() < 0.3 ? 1 : 0;
    const assists = Math.random() < 0.2 ? 1 : 0;
    const yellowCards = Math.random() < 0.1 ? 1 : 0;
    const redCards = Math.random() < 0.02 ? 1 : 0;
    
    return {
        rating: baseRating,
        goals: goals,
        assists: assists,
        yellowCards: yellowCards,
        redCards: redCards,
        passes: Math.floor(Math.random() * 30) + 20,
        tackles: player.position === 'DF' ? Math.floor(Math.random() * 8) + 2 : Math.floor(Math.random() * 3),
        shots: player.position === 'FW' ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 2)
    };
}

// 경기 평점 계산
function calculateMatchRating(player) {
    const overallRating = calculateOverallRating(player);
    const conditionFactor = player.condition / 100;
    const fatigueFactor = Math.max(0.7, (100 - player.fatigue) / 100);
    const formFactor = player.form / 100;
    
    const baseRating = (overallRating / 100) * 4 + 5; // 5.0 ~ 9.0
    const finalRating = baseRating * conditionFactor * fatigueFactor * formFactor;
    
    // 무작위 요소 추가
    const randomFactor = (Math.random() - 0.5) * 1.0;
    
    return Math.max(4.0, Math.min(10.0, finalRating + randomFactor));
}

// 경기 결과 표시
function showMatchResult(matchStats) {
    const teamScore = Math.floor(Math.random() * 4);
    const opponentScore = Math.floor(Math.random() * 3);
    
    let result = '';
    if (teamScore > opponentScore) result = '승리 🎉';
    else if (teamScore < opponentScore) result = '패배 😔';
    else result = '무승부 🤝';
    
    const resultText = `
        <strong>경기 결과: ${teamScore} : ${opponentScore} (${result})</strong><br><br>
        <strong>개인 성과:</strong><br>
        • 평점: ${matchStats.rating.toFixed(1)}/10<br>
        • 골: ${matchStats.goals}개<br>
        • 어시스트: ${matchStats.assists}개<br>
        • 패스: ${matchStats.passes}개<br>
        • 태클: ${matchStats.tackles}개<br>
        • 슈팅: ${matchStats.shots}개<br>
        ${matchStats.yellowCards > 0 ? `• 경고: ${matchStats.yellowCards}개<br>` : ''}
        ${matchStats.redCards > 0 ? `• 퇴장: ${matchStats.redCards}개<br>` : ''}
    `;
    
    document.getElementById('matchResultText').innerHTML = resultText;
    document.getElementById('matchResult').classList.remove('hidden');
}

// 시즌 종료 이벤트 생성
function generateSeasonEndEvent() {
    const player = gameState.player;
    
    showEvent('🏆 시즌 종료', 
        `시즌 ${gameState.currentSeason - 1}이 끝났습니다! 한 해 동안 수고하셨습니다. 새로운 시즌을 맞아 목표를 새롭게 설정해보세요.`,
        [{
            text: '다음 시즌 준비하기',
            effect: () => {
                updatePlayerMorale(player, +10);
                updatePlayerCondition(player, +20);
                updatePlayerFatigue(player, -30);
            }
        }]
    );
}

// 주간 이벤트 생성
function generateWeeklyEvents() {
    // 특별한 주차별 이벤트들은 여기서 처리
    const week = gameState.currentWeek;
    
    if (week === 1) {
        // 시즌 시작
    } else if (week === 19) {
        // 시즌 중반
    } else if (week === 38) {
        // 시즌 마지막 경기
    }
}

// 글로벌 에러 핸들러
window.addEventListener('error', function(e) {
    console.error('게임 오류:', e.error);
    alert('게임에서 오류가 발생했습니다. 새로고침 후 다시 시도해주세요.');
});

// 자동 저장 주기적 실행 (5분마다)
setInterval(() => {
    if (gameState.player && gameState.settings.autoSave) {
        saveGameState();
        console.log('자동 저장 완료');
    }
}, 300000);
                    
