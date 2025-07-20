// 플레이어 관련 함수들

// 명성 레벨 계산
function getFameLevel(fame) {
    if (fame >= 90) return "레전드";
    if (fame >= 80) return "월드클래스";
    if (fame >= 70) return "스타";
    if (fame >= 60) return "유명선수";
    if (fame >= 50) return "주전급";
    if (fame >= 40) return "프로선수";
    if (fame >= 30) return "유망주";
    if (fame >= 20) return "신인";
    return "무명";
}

// 컨디션 상태 텍스트
function getConditionStatus(condition) {
    if (condition >= 90) return "최상";
    if (condition >= 80) return "좋음";
    if (condition >= 70) return "보통";
    if (condition >= 60) return "나쁨";
    return "매우 나쁨";
}

// 피로도 상태 텍스트
function getFatigueStatus(fatigue) {
    if (fatigue <= 20) return "상쾌함";
    if (fatigue <= 40) return "보통";
    if (fatigue <= 60) return "피곤함";
    if (fatigue <= 80) return "지침";
    return "탈진";
}

// 폼 상태 텍스트
function getFormStatus(form) {
    if (form >= 90) return "환상적";
    if (form >= 80) return "좋은 폼";
    if (form >= 70) return "안정적";
    if (form >= 60) return "기복";
    return "슬럼프";
}

// 종합 능력치 계산 (간단한 버전)
function calculateOverallRating(player) {
    // 실제 선수는 기존 레이팅 사용
    if (player.isRealPlayer) {
        return player.rating;
    }
    
    // 새로 생성된 선수는 현재 능력치로 계산
    return player.rating;
}

// 선수 발전 가능성 체크
function canPlayerImprove(player) {
    return player.rating < player.potential;
}

// 선수 능력치 향상
function improvePlayerRating(player, amount) {
    const oldRating = player.rating;
    player.rating = Math.min(player.potential, player.rating + amount);
    return player.rating - oldRating;
}

// 선수 컨디션 변화
function updatePlayerCondition(player, change) {
    player.condition = Math.max(0, Math.min(100, player.condition + change));
}

// 선수 피로도 변화
function updatePlayerFatigue(player, change) {
    player.fatigue = Math.max(0, Math.min(100, player.fatigue + change));
}

// 선수 폼 변화
function updatePlayerForm(player, change) {
    player.form = Math.max(0, Math.min(100, player.form + change));
}

// 선수 사기 변화
function updatePlayerMorale(player, change) {
    player.morale = Math.max(0, Math.min(100, player.morale + change));
}

// 선수 명성 변화
function updatePlayerFame(player, change) {
    player.fame = Math.max(0, Math.min(100, player.fame + change));
}

// 부상 상태 체크
function isPlayerInjured(player) {
    return player.injury && player.injury.weeksRemaining > 0;
}

// 부상 적용
function injurePlayer(player, injuryType, weeks) {
    player.injury = {
        type: injuryType,
        weeksRemaining: weeks,
        severity: weeks > 4 ? "심각" : weeks > 2 ? "보통" : "가벼움"
    };
    
    // 부상으로 인한 컨디션 감소
    updatePlayerCondition(player, -20);
    updatePlayerMorale(player, -15);
}

// 부상 치료
function healPlayer(player) {
    if (player.injury) {
        player.injury.weeksRemaining--;
        if (player.injury.weeksRemaining <= 0) {
            delete player.injury;
            updatePlayerMorale(player, +10);
            return true; // 완치
        }
    }
    return false;
}

// 계약 갱신
function renewContract(player, years, newSalary) {
    player.contractYears = years;
    player.salary = newSalary;
    updatePlayerMorale(player, +5);
}

// 이적
function transferPlayer(player, newTeam, newSalary) {
    player.team = newTeam;
    player.salary = newSalary;
    updatePlayerMorale(player, Math.random() > 0.5 ? +5 : -5);
}

// 은퇴 체크
function shouldPlayerRetire(player) {
    // 나이와 능력치로 은퇴 여부 결정
    if (player.age >= 40) return true;
    if (player.age >= 35 && player.rating < 70) return true;
    if (player.age >= 38 && player.rating < 75) return true;
    return false;
}

// 주간 자연적 변화
function applyWeeklyChanges(player) {
    // 나이에 따른 자연적 변화
    const ageEffect = calculateAgeEffect(player.age);
    
    // 컨디션 자연 회복 (휴식하지 않았을 때)
    if (player.fatigue < 50) {
        updatePlayerCondition(player, Math.random() * 3 + 1);
    }
    
    // 피로도 자연 감소
    updatePlayerFatigue(player, -(Math.random() * 5 + 3));
    
    // 폼은 무작위로 변화
    const formChange = (Math.random() - 0.5) * 10;
    updatePlayerForm(player, formChange);
    
    // 나이 효과 적용
    if (ageEffect.ratingChange < 0) {
        // 노화로 인한 능력치 감소
        player.rating = Math.max(50, player.rating + ageEffect.ratingChange);
    }
    
    // 부상 치료
    if (isPlayerInjured(player)) {
        healPlayer(player);
    }
}

// 나이 효과 계산
function calculateAgeEffect(age) {
    let ratingChange = 0;
    let potentialChange = 0;
    
    if (age <= 23) {
        // 성장기 - 잠재력 보너스
        ratingChange = 0;
        potentialChange = 0;
    } else if (age <= 27) {
        // 전성기 - 변화 없음
        ratingChange = 0;
        potentialChange = 0;
    } else if (age <= 32) {
        // 쇠퇴 시작 - 느린 감소
        ratingChange = Math.random() < 0.1 ? -0.5 : 0;
        potentialChange = -0.5;
    } else if (age <= 35) {
        // 노화 가속
        ratingChange = Math.random() < 0.3 ? -1 : 0;
        potentialChange = -1;
    } else {
        // 급격한 노화
        ratingChange = Math.random() < 0.5 ? -1.5 : -0.5;
        potentialChange = -1.5;
    }
    
    return { ratingChange, potentialChange };
}

// 선수 통계 업데이트
function updatePlayerStats(player, matchStats) {
    const stats = player.careerStats;
    
    stats.appearances += 1;
    stats.goals += matchStats.goals || 0;
    stats.assists += matchStats.assists || 0;
    stats.yellowCards += matchStats.yellowCards || 0;
    stats.redCards += matchStats.redCards || 0;
    
    // 평균 평점 업데이트
    const totalRating = stats.averageRating * (stats.appearances - 1) + matchStats.rating;
    stats.averageRating = (totalRating / stats.appearances).toFixed(1);
}

// 선수 특성 추가
function addPlayerTrait(player, trait) {
    if (!player.traits.includes(trait)) {
        player.traits.push(trait);
    }
}

// 선수 기술 추가/향상
function improvePlayerSkill(player, skill, level = 1) {
    const existingSkill = player.skills.find(s => s.name === skill);
    
    if (existingSkill) {
        existingSkill.level = Math.min(5, existingSkill.level + level);
    } else {
        player.skills.push({ name: skill, level: level });
    }
}

// 선수 가치 계산 (이적료 등)
function calculatePlayerValue(player) {
    let baseValue = player.rating * 1000000; // 기본 1백만 x 레이팅
    
    // 나이 조정
    if (player.age <= 23) baseValue *= 1.5;
    else if (player.age <= 27) baseValue *= 1.2;
    else if (player.age <= 30) baseValue *= 1.0;
    else if (player.age <= 33) baseValue *= 0.7;
    else baseValue *= 0.4;
    
    // 명성 보너스
    baseValue *= (1 + player.fame / 200);
    
    // 부상 패널티
    if (isPlayerInjured(player)) {
        baseValue *= 0.6;
    }
    
    // 컨디션 조정
    baseValue *= (0.8 + player.condition / 500);
    
    return Math.floor(baseValue);
}

// 선수 상세 정보 생성
function getDetailedPlayerInfo(player) {
    return {
        basicInfo: {
            name: player.name,
            age: player.age,
            position: player.position,
            team: player.team,
            background: player.background
        },
        ratings: {
            overall: calculateOverallRating(player),
            potential: player.potential,
            condition: player.condition,
            fatigue: player.fatigue,
            form: player.form,
            morale: player.morale
        },
        career: {
            fame: player.fame,
            fameLevel: getFameLevel(player.fame),
            salary: player.salary,
            contractYears: player.contractYears,
            value: calculatePlayerValue(player)
        },
        stats: player.careerStats,
        traits: player.traits,
        skills: player.skills,
        injury: player.injury || null
    };
}
