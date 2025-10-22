<template>
  <div class="ranking-page">
    <div class="container">
      <h1>🏆 排行榜</h1>
      
      <div class="ranking-card">
        <div class="ranking-header">
          <div class="rank-column">排名</div>
          <div class="name-column">玩家</div>
          <div class="score-column">完成次数</div>
          <div class="time-column">最佳时间</div>
        </div>
        
        <div class="ranking-list">
          <div 
            v-for="(player, index) in rankings" 
            :key="player.id"
            class="ranking-item"
            :class="{
              'first': index === 0,
              'second': index === 1,
              'third': index === 2
            }"
          >
            <div class="rank-column">
              <span class="rank-number">{{ index + 1 }}</span>
              <span v-if="index === 0" class="rank-crown">👑</span>
            </div>
            <div class="name-column">
              <span class="player-name">{{ player.name }}</span>
            </div>
            <div class="score-column">
              <span class="completion-count">{{ player.completions }} 次</span>
            </div>
            <div class="time-column">
              <span class="best-time">{{ player.bestTime }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="personal-stats">
        <h2>您的统计</h2>
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-info">
              <div class="stat-value">3</div>
              <div class="stat-label">完成次数</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-info">
              <div class="stat-value">15:23</div>
              <div class="stat-label">最佳时间</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <div class="stat-value">75%</div>
              <div class="stat-label">成功率</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'RankingPage',
  setup() {
    const rankings = ref([
      { id: 1, name: '宝藏大师', completions: 12, bestTime: '08:45' },
      { id: 2, name: '冒险王', completions: 9, bestTime: '09:12' },
      { id: 3, name: '探索者', completions: 8, bestTime: '10:03' },
      { id: 4, name: '寻宝猎人', completions: 7, bestTime: '11:27' },
      { id: 5, name: '神秘旅人', completions: 6, bestTime: '12:15' },
      { id: 6, name: '新手玩家', completions: 3, bestTime: '15:23' },
      { id: 7, name: '游戏爱好者', completions: 2, bestTime: '18:45' },
      { id: 8, name: '游客', completions: 1, bestTime: '22:30' }
    ])
    
    return {
      rankings
    }
  }
}
</script>

<style scoped>
.ranking-page {
  padding: 2rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  min-height: 100vh;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.ranking-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.ranking-header {
  display: grid;
  grid-template-columns: 100px 1fr 150px 150px;
  padding: 1rem 1.5rem;
  background: #2c3e50;
  color: white;
  font-weight: 600;
}

.ranking-list {
  max-height: 400px;
  overflow-y: auto;
}

.ranking-item {
  display: grid;
  grid-template-columns: 100px 1fr 150px 150px;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s;
}

.ranking-item:hover {
  background-color: #f8f9fa;
}

.ranking-item.first {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
}

.ranking-item.second {
  background: linear-gradient(135deg, #c0c0c0, #e0e0e0);
}

.ranking-item.third {
  background: linear-gradient(135deg, #cd7f32, #e39e54);
}

.rank-column {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rank-number {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.rank-crown {
  font-size: 1.5rem;
}

.name-column {
  display: flex;
  align-items: center;
}

.player-name {
  font-weight: 500;
  color: #333;
}

.score-column, .time-column {
  display: flex;
  align-items: center;
}

.completion-count, .best-time {
  color: #666;
  font-weight: 500;
}

.personal-stats {
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 15px;
}

.personal-stats h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  gap: 1rem;
}

.stat-icon {
  font-size: 2rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffcc00;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .ranking-header,
  .ranking-item {
    grid-template-columns: 60px 1fr 100px 100px;
    padding: 0.75rem 1rem;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .ranking-header,
  .ranking-item {
    grid-template-columns: 50px 1fr 80px 80px;
    font-size: 0.9rem;
    padding: 0.5rem;
  }
  
  .rank-number {
    font-size: 1rem;
  }
}
</style>