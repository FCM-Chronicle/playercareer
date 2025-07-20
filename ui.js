// 경기 인터페이스 업데이트
function updateMatchInterface() {
    const player = gameState.player;
    
    try {
        // 현재 주차의 경기 찾기
        const currentFixtures = gameState.league.fixtures[gameState.currentWeek - 1];
        let playerMatch = null;
        
        if (currentFixtures) {
            // 플레이어 팀의 경기 찾기
            const playerTeamKey = Object.keys(teamNames).find(key => teamNames[key] === player.team);
            playerMatch = currentFixtures.find(fixture => 
                fixture.home === playerTeamKey || fixture.away === playerTeamKey
            );
        }

// 누락된 글로벌 함수들 추가
function showCreatePlayer() {
    hideAllScreens();
    document.getElementById('createPlayerScreen').classList.remove('hidden');
}

function showPlayerSelect() {
    hideAllScreens();
    document.getElementById('playerSelectScreen').classList.remove('hidden');
    initializePlayerGrid();
}

function startWithSelectedPlayer() {
    if (!selectedPlayer) {
        alert('선수를 선택해주세요.');
        return;
    }
    
    try {
        console.log('선택된 선수:', selectedPlayer);
        gameState.player = createRealPlayerData(selectedPlayer);
        console.log('플레이어 생성 완료:', gameState.player);
        
        showGameScreen();
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
        gameState.player = createNewPlayerData(name, position, age, background);
        gameState.player.customNationality = nationality;
        
        console.log('새 선수 생성 완료:', gameState.player);
        
        showGameScreen();
        showWelcomeEvent();
        
        console.log('새 선수 게임 시작 완료');
    } catch (error) {
        console.error('새 선수 생성 오류:', error);
        alert('선수 생성 중 오류가 발생했습니다: ' + error.message);
    }
}

function loadGame() {
    showLoadModal();
}

function saveGame() {
    saveGameToText();
}

function showLeagueStandings() {
    updateStandings();
    const standings = gameState.league.standings.slice(0, 10);
    
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

function nextWeek() {
    const player = gameState.player;
    
    if (isPlayerInjured(player)) {
        handleInjuryWeek();
        return;
    }
    
    applyWeeklyChanges(player);
    advanceWeek();
    
    player.trainedThisWeek = false;
    player.playedMatchThisWeek = false;
    
    const trainBtn = document.querySelector('#trainingSection .btn-primary');
    if (trainBtn) {
        trainBtn.disabled = false;
        trainBtn.textContent = '훈련 시작';
    }
    
    const matchBtn = document.getElementById('startMatchBtn');
    if (matchBtn && !isPlayerInjured(player)) {
        matchBtn.disabled = false;
        matchBtn.textContent = '경기 시작';
    }
    
    document.getElementById('trainingResult').classList.add('hidden');
    document.getElementById('matchResult').classList.add('hidden');
    
    updateDashboard();
    checkRandomEvents();
}

function executeTraining() {
    const player = gameState.player;
    
    if (isPlayerInjured(player)) {
        alert('부상 중에는 훈련할 수 없습니다.');
        return;
    }
    
    if (player.trainedThisWeek) {
        alert('이번 주에 이미 훈련을 완료했습니다. 다음 주에 다시 훈련하세요.');
        return;
    }
    
    const physicalIntensity = parseInt(document.getElementById('physicalTraining').value);
    const technicalIntensity = parseInt(document.getElementById('technicalTraining').value);
    const mentalIntensity = parseInt(document.getElementById('mentalTraining').value);
    
    const results = [];
    let totalFatigueIncrease = 0;
    
    if (physicalIntensity > 0) {
        const improvement = calculateTrainingImprovement(physicalIntensity, player.rating, player.potential);
        if (improvement > 0) {
            improvePlayerRating(player, improvement);
            results.push(`💪 피지컬 향상: +${improvement}`);
        }
        totalFatigueIncrease += physicalIntensity * 3;
    }
    
    if (technicalIntensity > 0) {
        const improvement = calculateTrainingImprovement(technicalIntensity, player.rating, player.potential);
        if (improvement > 0) {
            improvePlayerRating(player, improvement);
            results.push(`⚽ 기술 향상: +${improvement}`);
        }
        totalFatigueIncrease += technicalIntensity * 3;
    }
    
    if (mentalIntensity > 0) {
        const moraleImprovement = mentalIntensity * 2;
        updatePlayerMorale(player, moraleImprovement);
        results.push(`🧠 멘탈 강화: +${moraleImprovement}`);
        totalFatigueIncrease += mentalIntensity * 2;
    }
    
    updatePlayerFatigue(player, totalFatigueIncrease);
    
    const totalIntensity = physicalIntensity + technicalIntensity + mentalIntensity;
    if (totalIntensity === 0) {
        updatePlayerCondition(player, 15);
        updatePlayerFatigue(player, -20);
        results.push('😴 완전히 휴식했습니다. 컨디션이 크게 회복되었습니다.');
    } else if (totalIntensity <= 3) {
        updatePlayerCondition(player, 5);
    } else if (totalIntensity >= 7) {
        updatePlayerCondition(player, -5);
        results.push('⚠️ 과도한 훈련으로 컨디션이 약간 저하되었습니다.');
    }
    
    if (totalIntensity >= 8 && player.fatigue > 70) {
        const injuryChance = Math.random();
        if (injuryChance < 0.1) {
            const injuryTypes = ['근육 경련', '발목 삠', '무릎 통증', '등 통증'];
            const injuryType = injuryTypes[Math.floor(Math.random() * injuryTypes.length)];
            const weeks = Math.floor(Math.random() * 3) + 1;
            
            injurePlayer(player, injuryType, weeks);
            results.push(`🚨 부상 발생: ${injuryType} (${weeks}주 치료 필요)`);
        }
    }
    
    document.getElementById('trainingResultText').innerHTML = results.join('<br>');
    document.getElementById('trainingResult').classList.remove('hidden');
    
    player.trainedThisWeek = true;
    
    const trainBtn = document.querySelector('#trainingSection .btn-primary');
    if (trainBtn) {
        trainBtn.disabled = true;
        trainBtn.textContent = '이번 주 훈련 완료';
    }
    
    updateDashboard();
}

function startMatch() {
    const player = gameState.player;
    
    if (isPlayerInjured(player)) {
        alert('부상 중에는 경기에 참여할 수 없습니다.');
        return;
    }
    
    const hideLoading = showLoading(event.currentTarget);
    
    const matchLog = document.getElementById('matchLog');
    matchLog.classList.remove('hidden');
    matchLog.innerHTML = '';
    
    setTimeout(() => {
        hideLoading();
        simulateMatch();
    }, 1000);
}

function calculateTrainingImprovement(intensity, currentRating, potential) {
    if (currentRating >= potential) return 0;
    
    const baseImprovement = intensity * 0.5;
    const potentialFactor = (potential - currentRating) / potential;
    const randomFactor = Math.random() * 0.5 + 0.75;
    
    const improvement = baseImprovement * potentialFactor * randomFactor;
    return Math.round(improvement);
}
        
        if (playerMatch) {
            const isHome = playerMatch.home === Object.keys(teamNames).find(key => teamNames[key] === player.team);
            const opponent = isHome ? playerMatch.awayName : playerMatch.homeName;
            const venue = isHome ? '(홈)' : '(어웨이)';
            
            document.getElementById('nextMatchInfo').textContent = `${player.team} vs ${opponent} ${venue}`;
        } else {
            document.getElementById('nextMatchInfo').textContent = `${player.team} - 이번 주 경기 없음`;
        }
        
        // 경기 관련 정보
        document.getElementById('expectedPlayTime').textContent = player.condition > 70 ? '90분' : '45분';
        document.getElementById('matchCondition').textContent = `${player.condition}%`;
        
        // 경기 버튼 상태 체크
        const startBtn = document.getElementById('startMatchBtn');
        if (startBtn) {
            if (player.playedMatchThisWeek) {
                startBtn.disabled = true;
                startBtn.textContent = '이번 주 경기 완료';
            } else if (isPlayerInjured(player)) {
                startBtn.disabled = true;
                startBtn.textContent = '부상으로 경기 불가';
            } else if (!playerMatch) {
                startBtn.disabled = true;
                startBtn.textContent = '이번 주 경기 없음';
            } else {
                startBtn.disabled = false;
                startBtn.textContent = '경기 시작';
            }
        }
    } catch (error) {
        console.error('경기 인터페이스 업데이트 오류:', error);
        // 기본값 설정
        document.getElementById('nextMatchInfo').textContent = `${player.team} vs 상대팀`;
        document.getElementById('expectedPlayTime').textContent = '90분';
        document.getElementById('matchCondition').textContent = `${player.condition}%`;
    }
}// UI 관리 함수들

let selectedPlayer = null;
let filteredPlayers = [];
let currentTeamFilter = 'all';

// 화면 전환 함수들
function showStartScreen() {
    hideAllScreens();
    document.getElementById('startScreen').classList.remove('hidden');
}

function showPlayerSelect() {
    hideAllScreens();
    document.getElementById('playerSelectScreen').classList.remove('hidden');
    initializePlayerGrid();
}

function showCreatePlayer() {
    hideAllScreens();
    document.getElementById('createPlayerScreen').classList.remove('hidden');
}

function showGameScreen() {
    hideAllScreens();
    document.getElementById('gameScreen').classList.remove('hidden');
    showDashboard();
    updateDashboard();
}

function hideAllScreens() {
    const screens = ['startScreen', 'playerSelectScreen', 'createPlayerScreen', 'gameScreen'];
    screens.forEach(screen => {
        document.getElementById(screen).classList.add('hidden');
    });
}

// 게임 내 섹션 전환
function showDashboard() {
    hideAllGameSections();
    document.getElementById('dashboardSection').classList.remove('hidden');
}

function showTraining() {
    hideAllGameSections();
    document.getElementById('trainingSection').classList.remove('hidden');
    updateTrainingInterface();
}

function showMatch() {
    hideAllGameSections();
    document.getElementById('matchSection').classList.remove('hidden');
    updateMatchInterface();
}

function showPlayerInfo() {
    hideAllGameSections();
    document.getElementById('playerInfoSection').classList.remove('hidden');
    updatePlayerInfoInterface();
}

function hideAllGameSections() {
    const sections = ['dashboardSection', 'trainingSection', 'matchSection', 'playerInfoSection'];
    sections.forEach(section => {
        document.getElementById(section).classList.add('hidden');
    });
}

// 선수 그리드 초기화
function initializePlayerGrid() {
    filteredPlayers = getAllPlayers();
    displayPlayers(filteredPlayers);
}

// 선수 목록 표시
function displayPlayers(players) {
    const grid = document.getElementById('playerGrid');
    grid.innerHTML = '';
    
    players.forEach(player => {
        const playerCard = createPlayerCard(player);
        grid.appendChild(playerCard);
    });
}

// 선수 카드 생성
function createPlayerCard(player) {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.onclick = () => selectPlayer(player);
    
    card.innerHTML = `
        <div class="player-name">${player.name}</div>
        <div class="player-info">
            <div class="player-stat">
                <div class="stat-label">레이팅</div>
                <div class="stat-value">${player.rating}</div>
            </div>
            <div class="player-stat">
                <div class="stat-label">나이</div>
                <div class="stat-value">${player.age}세</div>
            </div>
            <div class="player-stat">
                <div class="stat-label">포지션</div>
                <div class="stat-value">${positionNames[player.position]}</div>
            </div>
            <div class="player-stat">
                <div class="stat-label">팀</div>
                <div class="stat-value">${player.teamName}</div>
            </div>
        </div>
        <div class="team-badge">${player.teamName}</div>
    `;
    
    return card;
}

// 선수 선택
function selectPlayer(player) {
    // 이전 선택 해제
    document.querySelectorAll('.player-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 새 선수 선택
    selectedPlayer = player;
    event.currentTarget.classList.add('selected');
    
    // 선택된 선수 정보 표시
    showSelectedPlayerInfo(player);
}

// 선택된 선수 정보 표시
function showSelectedPlayerInfo(player) {
    const infoDiv = document.getElementById('selectedPlayerInfo');
    const detailsDiv = document.getElementById('selectedPlayerDetails');
    
    detailsDiv.innerHTML = `
        <div class="player-name">${player.name}</div>
        <div class="player-info">
            <div class="player-stat">
                <div class="stat-label">종합 레이팅</div>
                <div class="stat-value">${player.rating}</div>
            </div>
            <div class="player-stat">
                <div class="stat-label">나이</div>
                <div class="stat-value">${player.age}세</div>
            </div>
            <div class="player-stat">
                <div class="stat-label">포지션</div>
                <div class="stat-value">${positionNames[player.position]}</div>
            </div>
            <div class="player-stat">
                <div class="stat-label">소속팀</div>
                <div class="stat-value">${player.teamName}</div>
            </div>
        </div>
        <p><strong>잠재력:</strong> ${calculatePotentialFromAge(player.age, player.rating)}</p>
        <p><strong>예상 주급:</strong> ₩${calculateSalaryFromRating(player.rating).toLocaleString()}</p>
    `;
    
    infoDiv.classList.remove('hidden');
}

// 필터링 함수들
function filterByTeam(teamKey) {
    currentTeamFilter = teamKey;
    
    // 탭 활성화 상태 변경
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // 필터링 및 표시
    filteredPlayers = filterPlayersByTeam(teamKey);
    const searchTerm = document.getElementById('playerSearch').value;
    if (searchTerm) {
        filteredPlayers = filteredPlayers.filter(player => 
            player.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    displayPlayers(filteredPlayers);
}

function filterPlayers() {
    const searchTerm = document.getElementById('playerSearch').value.toLowerCase();
    
    let players = filterPlayersByTeam(currentTeamFilter);
    
    if (searchTerm) {
        players = players.filter(player => 
            player.name.toLowerCase().includes(searchTerm)
        );
    }
    
    filteredPlayers = players;
    displayPlayers(filteredPlayers);
}

// 대시보드 업데이트
function updateDashboard() {
    if (!gameState.player) return;
    
    const player = gameState.player;
    
    // 기본 정보 업데이트
    document.getElementById('dashPlayerName').textContent = player.name;
    document.getElementById('dashPlayerAge').textContent = `${player.age}세`;
    document.getElementById('dashPlayerPosition').textContent = positionNames[player.position] || player.position;
    document.getElementById('dashTeam').textContent = player.team;
    document.getElementById('dashFame').textContent = getFameLevel(player.fame);
    
    // 시즌/주차 정보
    document.getElementById('currentSeason').textContent = gameState.currentSeason;
    document.getElementById('currentWeek').textContent = gameState.currentWeek;
    
    // 능력치 업데이트
    const overallRating = calculateOverallRating(player);
    updateProgressBar('overallBar', 'overallRating', overallRating, 99);
    updateProgressBar('conditionBar', 'conditionValue', player.condition, 100);
    updateProgressBar('fatigueBar', 'fatigueValue', player.fatigue, 100);
    
    // 알림 업데이트
    updateNotifications();
}

// 프로그레스 바 업데이트
function updateProgressBar(barId, valueId, value, max) {
    const bar = document.getElementById(barId);
    const valueEl = document.getElementById(valueId);
    
    if (bar && valueEl) {
        const percentage = (value / max) * 100;
        bar.style.width = `${percentage}%`;
        valueEl.textContent = Math.round(value);
    }
}

// 알림 업데이트
function updateNotifications() {
    const notifications = [];
    const player = gameState.player;
    
    // 컨디션 관련 알림
    if (player.condition < 70) {
        notifications.push('⚠️ 컨디션이 좋지 않습니다. 휴식을 취하세요.');
    }
    
    // 피로도 관련 알림
    if (player.fatigue > 80) {
        notifications.push('😴 피로도가 높습니다. 강도 높은 훈련을 피하세요.');
    }
    
    // 부상 관련 알림
    if (isPlayerInjured(player)) {
        notifications.push(`🏥 부상 중입니다. ${player.injury.weeksRemaining}주 더 치료가 필요합니다.`);
    }
    
    // 계약 관련 알림
    if (player.contractYears <= 1) {
        notifications.push('📝 계약이 곧 만료됩니다. 재계약을 고려하세요.');
    }
    
    // 경기 관련 알림
    if (gameState.currentWeek % 4 === 0) {
        notifications.push('⚽ 이번 주는 중요한 경기가 있습니다!');
    }
    
    const notificationText = notifications.length > 0 ? 
        notifications.join(' / ') : 
        '✅ 특별한 알림이 없습니다. 훈련에 집중하세요!';
    
    document.getElementById('notificationText').textContent = notificationText;
}

// 훈련 인터페이스 업데이트
function updateTrainingInterface() {
    const player = gameState.player;
    
    // 훈련 선택에 따른 미리보기 업데이트
    updateTrainingPreview();
    
    // 훈련 버튼 상태 체크
    const trainBtn = document.querySelector('#trainingSection .btn-primary');
    if (trainBtn) {
        if (player.trainedThisWeek) {
            trainBtn.disabled = true;
            trainBtn.textContent = '이번 주 훈련 완료';
        } else if (isPlayerInjured(player)) {
            trainBtn.disabled = true;
            trainBtn.textContent = '부상으로 훈련 불가';
        } else {
            trainBtn.disabled = false;
            trainBtn.textContent = '훈련 시작';
        }
    }
}

// 경기 인터페이스 업데이트
function updateMatchInterface() {
    const player = gameState.player;
    
    // 다음 경기 정보
    const opponents = ['라이벌팀', '강호팀', '약체팀', '중위권팀'];
    const opponent = opponents[gameState.currentWeek % opponents.length];
    document.getElementById('nextMatchInfo').textContent = `${player.team} vs ${opponent}`;
    
    // 경기 관련 정보
    document.getElementById('expectedPlayTime').textContent = player.condition > 70 ? '90분' : '45분';
    document.getElementById('matchCondition').textContent = `${player.condition}%`;
    
    // 경기 버튼 상태 체크
    const startBtn = document.getElementById('startMatchBtn');
    if (startBtn) {
        if (player.playedMatchThisWeek) {
            startBtn.disabled = true;
            startBtn.textContent = '이번 주 경기 완료';
        } else if (isPlayerInjured(player)) {
            startBtn.disabled = true;
            startBtn.textContent = '부상으로 경기 불가';
        } else {
            startBtn.disabled = false;
            startBtn.textContent = '경기 시작';
        }
    }
}

// 선수 정보 인터페이스 업데이트
function updatePlayerInfoInterface() {
    const player = gameState.player;
    const detailedInfo = getDetailedPlayerInfo(player);
    
    const detailsDiv = document.getElementById('detailedStats');
    
    detailsDiv.innerHTML = `
        <div class="stats-card">
            <h3>기본 정보</h3>
            <div class="player-info">
                <div class="player-stat">
                    <div class="stat-label">이름</div>
                    <div class="stat-value">${detailedInfo.basicInfo.name}</div>
                </div>
                <div class="player-stat">
                    <div class="stat-label">나이</div>
                    <div class="stat-value">${detailedInfo.basicInfo.age}세</div>
                </div>
                <div class="player-stat">
                    <div class="stat-label">포지션</div>
                    <div class="stat-value">${positionNames[detailedInfo.basicInfo.position]}</div>
                </div>
                <div class="player-stat">
                    <div class="stat-label">소속팀</div>
                    <div class="stat-value">${detailedInfo.basicInfo.team}</div>
                </div>
            </div>
        </div>
        
        <div class="stats-card">
            <h3>능력치</h3>
            <div class="stat-bar">
                <div class="stat-label">종합 능력치 <span>${detailedInfo.ratings.overall}</span></div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(detailedInfo.ratings.overall/99)*100}%"></div>
                </div>
            </div>
            <div class="stat-bar">
                <div class="stat-label">잠재력 <span>${detailedInfo.ratings.potential}</span></div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(detailedInfo.ratings.potential/99)*100}%"></div>
                </div>
            </div>
            <div class="stat-bar">
                <div class="stat-label">컨디션 <span>${detailedInfo.ratings.condition}</span></div>
                <div class="progress-bar">
                    <div class="progress-fill condition-bar" style="width: ${detailedInfo.ratings.condition}%"></div>
                </div>
            </div>
            <div class="stat-bar">
                <div class="stat-label">피로도 <span>${detailedInfo.ratings.fatigue}</span></div>
                <div class="progress-bar">
                    <div class="progress-fill fatigue-bar" style="width: ${detailedInfo.ratings.fatigue}%"></div>
                </div>
            </div>
        </div>
        
        <div class="stats-card">
            <h3>커리어 통계</h3>
            <div class="player-info">
                <div class="player-stat">
                    <div class="stat-label">경기 수</div>
                    <div class="stat-value">${detailedInfo.stats.appearances}</div>
                </div>
                <div class="player-stat">
                    <div class="stat-label">골</div>
                    <div class="stat-value">${detailedInfo.stats.goals}</div>
                </div>
                <div class="player-stat">
                    <div class="stat-label">도움</div>
                    <div class="stat-value">${detailedInfo.stats.assists}</div>
                </div>
                <div class="player-stat">
                    <div class="stat-label">평균 평점</div>
                    <div class="stat-value">${detailedInfo.stats.averageRating}</div>
                </div>
            </div>
        </div>
        
        <div class="stats-card">
            <h3>경력 정보</h3>
            <div class="player-info">
                <div class="player-stat">
                    <div class="stat-label">명성</div>
                    <div class="stat-value">${detailedInfo.career.fameLevel}</div>
                </div>
                <div class="player-stat">
                    <div class="stat-label">주급</div>
                    <div class="stat-value">₩${detailedInfo.career.salary.toLocaleString()}</div>
                </div>
                <div class="player-stat">
                    <div class="stat-label">계약 기간</div>
                    <div class="stat-value">${detailedInfo.career.contractYears}년</div>
                </div>
                <div class="player-stat">
                    <div class="stat-label">시장 가치</div>
                    <div class="stat-value">₩${detailedInfo.career.value.toLocaleString()}</div>
                </div>
            </div>
        </div>
        
        ${detailedInfo.traits.length > 0 ? `
        <div class="stats-card">
            <h3>특성</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                ${detailedInfo.traits.map(trait => `<span class="team-badge">${trait}</span>`).join('')}
            </div>
        </div>
        ` : ''}
        
        ${detailedInfo.injury ? `
        <div class="stats-card" style="border-left: 4px solid #ff6b6b;">
            <h3>부상 정보</h3>
            <p><strong>부상 유형:</strong> ${detailedInfo.injury.type}</p>
            <p><strong>심각도:</strong> ${detailedInfo.injury.severity}</p>
            <p><strong>회복까지:</strong> ${detailedInfo.injury.weeksRemaining}주</p>
        </div>
        ` : ''}
    `;
}

// 모달 표시/숨김
function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// 성공/실패 효과
function showSuccessEffect(element) {
    element.classList.add('success');
    setTimeout(() => element.classList.remove('success'), 500);
}

function showFailureEffect(element) {
    element.classList.add('failure');
    setTimeout(() => element.classList.remove('failure'), 500);
}

// 로딩 상태 표시
function showLoading(buttonElement) {
    const originalText = buttonElement.textContent;
    buttonElement.innerHTML = '<span class="loading"></span> 처리중...';
    buttonElement.disabled = true;
    
    return () => {
        buttonElement.textContent = originalText;
        buttonElement.disabled = false;
    };
}

// 이벤트 표시 함수 (main.js에서 사용)
function showEvent(title, text, choices) {
    console.log('이벤트 표시:', title);
    
    // 모달이 이미 존재하면 제거
    const existingModal = document.getElementById('eventModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 새 모달 생성
    const modal = document.createElement('div');
    modal.id = 'eventModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${title}</h3>
            <p style="white-space: pre-line; margin: 20px 0;">${text}</p>
            <div id="eventChoicesContainer" class="choice-buttons"></div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 선택지 버튼 추가
    const choicesContainer = document.getElementById('eventChoicesContainer');
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'btn';
        button.textContent = choice.text;
        button.onclick = () => {
            try {
                choice.effect();
                modal.remove();
            } catch (error) {
                console.error('이벤트 선택 효과 오류:', error);
                modal.remove();
            }
        };
        choicesContainer.appendChild(button);
    });
}
