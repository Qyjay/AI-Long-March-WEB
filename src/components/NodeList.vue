<template>
  <div class="node-list-container bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- 头部 -->
    <div class="p-4 bg-gradient-to-r from-primary to-secondary text-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold">长征节点</h2>
          <p class="text-sm opacity-90 mt-1">{{ getProgressText() }}</p>
        </div>
        <div class="flex items-center gap-3">
          <!-- 统计信息 -->
          <div class="text-right">
            <div class="text-sm opacity-90">
              {{ visitedCount }}/{{ totalCount }}
            </div>
            <div class="text-xs opacity-75">
              {{ Math.round(progressPercentage) }}% 完成
            </div>
          </div>
          <!-- 进度条 -->
          <div class="w-20 bg-white bg-opacity-20 rounded-full h-3">
            <div class="bg-white h-3 rounded-full transition-all duration-500 relative overflow-hidden"
              :style="{ width: progressPercentage + '%' }">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-30 animate-pulse"></div>
            </div>
          </div>
          <!-- 视图切换按钮 -->
          <button @click="toggleViewMode"
            class="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            :title="viewMode === 'list' ? '切换到卡片视图' : '切换到列表视图'">
            <svg v-if="viewMode === 'list'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center gap-3 mb-3">
        <div class="relative flex-1">
          <input v-model="searchQuery" type="text" placeholder="搜索节点名称、描述或标签..."
            class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
          <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd" />
          </svg>
          <button v-if="searchQuery" @click="searchQuery = ''"
            class="absolute right-3 top-2.5 w-5 h-5 text-gray-400 hover:text-gray-600">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- 筛选栏收缩按钮 -->
        <button @click="toggleFilterCollapse"
          class="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1 text-sm text-gray-600"
          :title="isFilterCollapsed ? '展开筛选' : '收起筛选'">
          <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': isFilterCollapsed }"
            fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
          <span class="hidden sm:inline">{{ isFilterCollapsed ? '展开' : '收起' }}</span>
        </button>
      </div>

      <!-- 筛选器 (可收缩) -->
      <div v-show="!isFilterCollapsed" class="transition-all duration-300 ease-in-out overflow-hidden">
        <div class="flex flex-wrap gap-2 mb-3">
          <button v-for="filter in filters" :key="filter.key" @click="toggleFilter(filter.key)"
            class="px-3 py-1 text-sm rounded-full border transition-all duration-200 flex items-center gap-1" :class="activeFilters.includes(filter.key)
              ? 'bg-primary text-white border-primary shadow-md transform scale-105'
              : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 hover:border-gray-400'">
            <span>{{ filter.label }}</span>
            <span v-if="activeFilters.includes(filter.key)" class="text-xs">
              ({{ getFilterCount(filter.key) }})
            </span>
          </button>
        </div>

        <!-- 排序选项 -->
        <div class="flex items-center gap-2 text-sm">
          <span class="text-gray-600">排序:</span>
          <select v-model="sortBy"
            class="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary">
            <option value="order">默认顺序</option>
            <option value="name">名称</option>
            <option value="distance">距离</option>
            <option value="visited">访问状态</option>
          </select>
          <button @click="toggleSortOrder" class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            :title="sortOrder === 'asc' ? '升序' : '降序'">
            <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': sortOrder === 'desc' }"
              fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 节点列表 -->
    <div class="max-h-96 overflow-y-auto">
      <div v-if="filteredNodes.length === 0" class="p-8 text-center text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd" />
        </svg>
        <p>没有找到匹配的节点</p>
        <p class="text-xs mt-1">尝试调整搜索条件或筛选器</p>
      </div>

      <!-- 列表视图 -->
      <div v-else-if="viewMode === 'list'">
        <div v-for="node in filteredNodes" :key="node.id"
          class="node-item border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
          @click="selectNode(node)">
          <div class="p-4">
            <div class="flex items-start gap-3">
              <!-- 节点状态图标 -->
              <div class="flex-shrink-0 mt-1">
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                  :class="getNodeStatusClass(node)">
                  <svg v-if="isNodeVisited(node.id)" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                  <div v-else-if="isCurrentNode(node.id)" class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>

              <!-- 节点信息 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">{{
                    node.name_zh || node.name }}</h3>
                  <span v-if="isCurrentNode(node.id)"
                    class="px-2 py-0.5 text-xs bg-primary text-white rounded-full animate-pulse">
                    当前
                  </span>
                  <!-- 完成度指示器 -->
                  <div class="flex-shrink-0">
                    <div class="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                        :style="{ width: getNodeCompletionRate(node) + '%' }"></div>
                    </div>
                  </div>
                </div>

                <p class="text-sm text-gray-600 line-clamp-2 mb-2">{{ node.summary_zh || node.summary }}</p>

                <!-- 节点标签 -->
                <div class="flex flex-wrap gap-1 mb-2">
                  <span v-for="tag in getNodeTags(node)" :key="tag"
                    class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                    {{ tag }}
                  </span>
                </div>

                <!-- 距离和时间信息 -->
                <div class="flex items-center gap-4 text-xs text-gray-500">
                  <span v-if="node.distance" class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clip-rule="evenodd" />
                    </svg>
                    {{ formatDistance(node.distance) }}
                  </span>

                  <span v-if="node.duration" class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clip-rule="evenodd" />
                    </svg>
                    {{ formatDuration(node.duration) }}
                  </span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button @click.stop="flyToNode(node)"
                  class="p-2 text-gray-400 hover:text-primary hover:bg-primary hover:bg-opacity-10 rounded-lg transition-all duration-200 transform hover:scale-110"
                  title="定位到地图">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clip-rule="evenodd" />
                  </svg>
                </button>

                <button v-if="hasNodeStory(node.id)" @click.stop="showNodeStory(node)"
                  class="p-2 text-gray-400 hover:text-secondary hover:bg-secondary hover:bg-opacity-10 rounded-lg transition-all duration-200 transform hover:scale-110"
                  title="查看故事">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </button>

                <button @click.stop="showNodeDetails(node)"
                  class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                  title="查看详情">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 卡片视图 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div v-for="node in filteredNodes" :key="node.id"
          class="node-card bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden"
          @click="selectNode(node)">
          <div class="p-4">
            <!-- 卡片头部 -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                  :class="getNodeStatusClass(node)">
                  <svg v-if="isNodeVisited(node.id)" class="w-3.5 h-3.5 text-white" fill="currentColor"
                    viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                  <div v-else-if="isCurrentNode(node.id)" class="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                </div>
                <h3 class="font-semibold text-gray-900 group-hover:text-primary transition-colors">{{ node.name }}</h3>
              </div>
              <span v-if="isCurrentNode(node.id)"
                class="px-2 py-1 text-xs bg-primary text-white rounded-full animate-pulse">
                当前
              </span>
            </div>

            <!-- 完成度进度条 -->
            <div class="mb-3">
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs text-gray-500">完成度</span>
                <span class="text-xs font-medium text-gray-700">{{ getNodeCompletionRate(node) }}%</span>
              </div>
              <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                  :style="{ width: getNodeCompletionRate(node) + '%' }"></div>
              </div>
            </div>

            <!-- 节点描述 -->
            <p class="text-sm text-gray-600 line-clamp-3 mb-3">{{ node.summary_zh || node.summary }}</p>

            <!-- 节点标签 -->
            <div class="flex flex-wrap gap-1 mb-3">
              <span v-for="tag in getNodeTags(node).slice(0, 3)" :key="tag"
                class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                {{ tag }}
              </span>
              <span v-if="getNodeTags(node).length > 3"
                class="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                +{{ getNodeTags(node).length - 3 }}
              </span>
            </div>

            <!-- 距离和时间信息 -->
            <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span v-if="node.distance" class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clip-rule="evenodd" />
                </svg>
                {{ formatDistance(node.distance) }}
              </span>

              <span v-if="node.duration" class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd" />
                </svg>
                {{ formatDuration(node.duration) }}
              </span>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-2">
              <button @click.stop="flyToNode(node)"
                class="flex-1 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                定位
              </button>
              <button v-if="hasNodeStory(node.id)" @click.stop="showNodeStory(node)"
                class="flex-1 px-3 py-2 text-sm bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors">
                故事
              </button>
              <button @click.stop="showNodeDetails(node)"
                class="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作 -->
    <div class="p-4 bg-gray-50 border-t border-gray-200">
      <div class="flex gap-2">
        <button @click="goToNextNode" :disabled="!hasNextNode"
          class="btn-primary flex-1 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
          前往下一个节点
        </button>

        <button @click="showRouteOverview" class="btn-secondary px-4 py-2 text-sm">
          路线概览
        </button>
      </div>
    </div>

    <!-- 节点详情面板 -->
    <div v-if="showNodeDetail && selectedNode"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeNodeDetail">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <!-- 详情头部 -->
        <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center"
              :class="getNodeStatusClass(selectedNode)">
              <svg v-if="isNodeVisited(selectedNode.id)" class="w-4 h-4 text-white" fill="currentColor"
                viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
              <div v-else-if="isCurrentNode(selectedNode.id)" class="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ selectedNode.name_zh || selectedNode.name }}</h2>
              <p class="text-sm text-gray-500">节点详细信息</p>
            </div>
          </div>
          <button @click="closeNodeDetail"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- 详情内容 -->
        <div class="p-6">
          <!-- 完成度统计 -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-lg font-semibold text-gray-900">完成度统计</h3>
              <span class="text-2xl font-bold text-primary">{{ getNodeCompletionRate(selectedNode) }}%</span>
            </div>
            <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div class="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                :style="{ width: getNodeCompletionRate(selectedNode) + '%' }"></div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full"
                  :class="isNodeVisited(selectedNode.id) ? 'bg-green-500' : 'bg-gray-300'"></div>
                <span>{{ isNodeVisited(selectedNode.id) ? '已访问' : '未访问' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full"
                  :class="hasNodeStory(selectedNode.id) ? 'bg-blue-500' : 'bg-gray-300'"></div>
                <span>{{ hasNodeStory(selectedNode.id) ? '有故事' : '无故事' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full"
                  :class="(selectedNode.poem_zh || selectedNode.poem) ? 'bg-purple-500' : 'bg-gray-300'"></div>
                <span>{{ (selectedNode.poem_zh || selectedNode.poem) ? '有诗词' : '无诗词' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full"
                  :class="getNodeTags(selectedNode).length ? 'bg-orange-500' : 'bg-gray-300'"></div>
                <span>{{ getNodeTags(selectedNode).length || 0 }} 个标签</span>
              </div>
            </div>
          </div>

          <!-- 节点描述 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">节点描述</h3>
            <p class="text-gray-700 leading-relaxed">{{ selectedNode.summary_zh || selectedNode.summary }}</p>
            <div v-if="selectedNode.description_zh || selectedNode.description" class="mt-4">
              <h4 class="text-md font-medium text-gray-800 mb-2">详细描述</h4>
              <p class="text-gray-600 leading-relaxed text-sm">{{ selectedNode.description_zh ||
                selectedNode.description }}</p>
            </div>
          </div>

          <!-- 诗词内容 -->
          <div v-if="selectedNode.poem_zh || selectedNode.poem" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">相关诗词</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-gray-800 italic leading-relaxed whitespace-pre-line">{{ selectedNode.poem_zh ||
                selectedNode.poem }}</p>
            </div>
          </div>

          <!-- 节点标签 -->
          <div v-if="getNodeTags(selectedNode).length" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">节点标签</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in getNodeTags(selectedNode)" :key="tag"
                class="px-3 py-1 text-sm bg-primary bg-opacity-10 text-primary rounded-full border border-primary border-opacity-20">
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 时间信息 -->
          <div v-if="selectedNode.time_zh || selectedNode.time" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">时间信息</h3>
            <div class="bg-blue-50 rounded-lg p-4">
              <p class="text-blue-800 font-medium">{{ selectedNode.time_zh || selectedNode.time }}</p>
            </div>
          </div>

          <!-- 历史意义 -->
          <div v-if="selectedNode.historical_significance" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">历史意义</h3>
            <div class="bg-yellow-50 rounded-lg p-4">
              <p class="text-yellow-800 leading-relaxed">{{ selectedNode.historical_significance }}</p>
            </div>
          </div>

          <!-- 伤亡情况 -->
          <div v-if="selectedNode.casualties" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">伤亡情况</h3>
            <div class="bg-red-50 rounded-lg p-4">
              <p class="text-red-800 leading-relaxed">{{ selectedNode.casualties }}</p>
            </div>
          </div>

          <!-- 环境信息 -->
          <div v-if="selectedNode.weather || selectedNode.terrain" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">环境信息</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="selectedNode.weather" class="bg-gray-50 rounded-lg p-3">
                <h4 class="text-sm font-medium text-gray-700 mb-1">天气情况</h4>
                <p class="text-gray-600 text-sm">{{ selectedNode.weather }}</p>
              </div>
              <div v-if="selectedNode.terrain" class="bg-gray-50 rounded-lg p-3">
                <h4 class="text-sm font-medium text-gray-700 mb-1">地形特点</h4>
                <p class="text-gray-600 text-sm">{{ selectedNode.terrain }}</p>
              </div>
            </div>
          </div>

          <!-- 位置和距离信息 -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">位置信息</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="selectedNode.lng && selectedNode.lat" class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clip-rule="evenodd" />
                </svg>
                <span>经度: {{ selectedNode.lng.toFixed(3) }}, 纬度: {{ selectedNode.lat.toFixed(3) }}</span>
              </div>

              <div v-if="selectedNode.distance" class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                </svg>
                <span>距离: {{ formatDistance(selectedNode.distance) }}</span>
              </div>
              <div v-if="selectedNode.duration" class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd" />
                </svg>
                <span>用时: {{ formatDuration(selectedNode.duration) }}</span>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex gap-3">
            <button @click="flyToNode(selectedNode)"
              class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clip-rule="evenodd" />
              </svg>
              定位到地图
            </button>
            <button v-if="hasNodeStory(selectedNode.id)" @click="showNodeStory(selectedNode)"
              class="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              查看故事
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useProgressStore } from '../stores/progress'
import { apiClient } from '../api'
import { eventBus } from '../utils/bus'
import { calculateDistance } from '../utils/geo'

/**
 * 节点列表组件
 * 显示长征路线上的所有节点，支持搜索、筛选和状态管理
 */

// Props
const props = defineProps({
  // 是否显示详细信息
  showDetails: {
    type: Boolean,
    default: true
  },
  // 最大高度
  maxHeight: {
    type: String,
    default: '400px'
  }
})

// Emits
const emit = defineEmits([
  'node-select',
  'node-visit',
  'show-story'
])

// 响应式数据
const nodes = ref([])
const searchQuery = ref('')
const activeFilters = ref([])
const isLoading = ref(true)
const viewMode = ref('list') // 'list' | 'card'
const sortBy = ref('order') // 'order' | 'name' | 'distance' | 'visited'
const sortOrder = ref('asc') // 'asc' | 'desc'
const selectedNode = ref(null)
const showNodeDetail = ref(false)
const isFilterCollapsed = ref(false) // 筛选栏收缩状态

// 存储
const progressStore = useProgressStore()

// 筛选选项
const filters = [
  { key: 'unvisited', label: '未访问' },
  { key: 'current', label: '当前位置' },
  { key: 'battle', label: '战斗' },
  { key: 'meeting', label: '会议' },
  { key: 'crossing', label: '渡河' },
  { key: 'mountain', label: '翻山' }
]

// 计算属性
const totalCount = computed(() => nodes.value.length)
const visitedCount = computed(() => progressStore.visited.length)
const progressPercentage = computed(() => {
  return totalCount.value > 0 ? (visitedCount.value / totalCount.value) * 100 : 0
})

const filteredNodes = computed(() => {
  let result = nodes.value

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(node =>
      node.name.toLowerCase().includes(query) ||
      node.summary.toLowerCase().includes(query) ||
      node.poem.toLowerCase().includes(query) ||
      (node.tags && node.tags.some(tag => tag.toLowerCase().includes(query)))
    )
  }

  // 状态过滤
  if (activeFilters.value.length > 0) {
    result = result.filter(node => {
      return activeFilters.value.some(filter => {
        switch (filter) {
          case 'unvisited':
            return !isNodeVisited(node.id)
          case 'current':
            return isCurrentNode(node.id)
          case 'battle':
          case 'meeting':
          case 'crossing':
          case 'mountain':
            return node.tags && node.tags.includes(filter)
          default:
            return false
        }
      })
    })
  }

  // 排序
  result.sort((a, b) => {
    let comparison = 0

    switch (sortBy.value) {
      case 'name':
        comparison = a.name.localeCompare(b.name, 'zh-CN')
        break
      case 'distance':
        comparison = (a.distance || 0) - (b.distance || 0)
        break
      case 'visited':
        const aVisited = isNodeVisited(a.id) ? 1 : 0
        const bVisited = isNodeVisited(b.id) ? 1 : 0
        comparison = bVisited - aVisited
        break
      default: // 'order'
        comparison = (a.order || 0) - (b.order || 0)
    }

    return sortOrder.value === 'desc' ? -comparison : comparison
  })

  return result
})

const hasNextNode = computed(() => {
  const currentIndex = nodes.value.findIndex(node => node.id === progressStore.currentNodeId)
  return currentIndex >= 0 && currentIndex < nodes.value.length - 1
})

const nextNode = computed(() => {
  const currentIndex = nodes.value.findIndex(node => node.id === progressStore.currentNodeId)
  if (currentIndex >= 0 && currentIndex < nodes.value.length - 1) {
    return nodes.value[currentIndex + 1]
  }
  return null
})

/**
 * 加载节点数据
 */
const loadNodes = async () => {
  try {
    isLoading.value = true
    const nodesData = await apiClient.getNodes()

    // 计算节点间距离（如果需要）
    nodes.value = nodesData.map((node, index) => {
      if (index > 0) {
        const prevNode = nodesData[index - 1]
        node.distance = calculateDistance(
          prevNode.coordinates,
          node.coordinates
        )
      }
      return node
    })

  } catch (error) {
    console.error('加载节点数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

/**
 * 切换筛选器
 */
const toggleFilter = (filterKey) => {
  const index = activeFilters.value.indexOf(filterKey)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
  } else {
    activeFilters.value.push(filterKey)
  }
}

/**
 * 选择节点
 */
const selectNode = (node) => {
  emit('node-select', node)
  eventBus.emit('fly-to-node', node.id, 12)
}

/**
 * 飞行到节点
 */
const flyToNode = (node) => {
  eventBus.emit('fly-to-node', node.id, 12)
}

/**
 * 显示节点故事
 */
const showNodeStory = (node) => {
  emit('show-story', node)
  eventBus.emit('show-node-story', node)
}

/**
 * 前往下一个节点
 */
const goToNextNode = () => {
  if (nextNode.value) {
    progressStore.goto(nextNode.value.id)
    emit('node-visit', nextNode.value)
    eventBus.emit('fly-to-node', nextNode.value.id, 12)
  }
}

/**
 * 显示路线概览
 */
const showRouteOverview = () => {
  eventBus.emit('show-route-overview')
}

/**
 * 检查节点是否已访问
 */
const isNodeVisited = (nodeId) => {
  return progressStore.isNodeVisited(nodeId)
}

/**
 * 检查是否为当前节点
 */
const isCurrentNode = (nodeId) => {
  return progressStore.currentNodeId === nodeId
}

/**
 * 检查节点是否有故事
 */
const hasNodeStory = (nodeId) => {
  // 这里可以根据实际情况判断节点是否有相关故事
  return true
}

/**
 * 获取节点状态样式类
 */
const getNodeStatusClass = (node) => {
  if (isCurrentNode(node.id)) {
    return 'bg-primary border-primary'
  } else if (isNodeVisited(node.id)) {
    return 'bg-green-500 border-green-500'
  } else {
    return 'bg-gray-200 border-gray-300'
  }
}

/**
 * 格式化距离
 */
const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`
  } else {
    return `${distance.toFixed(1)}km`
  }
}

/**
 * 格式化持续时间
 */
const formatDuration = (duration) => {
  if (duration < 60) {
    return `${duration}分钟`
  } else if (duration < 1440) {
    return `${Math.round(duration / 60)}小时`
  } else {
    return `${Math.round(duration / 1440)}天`
  }
}

/**
 * 获取进度文本描述
 */
const getProgressText = () => {
  const percentage = Math.round(progressPercentage.value)
  if (percentage === 0) {
    return '长征之路即将开始'
  } else if (percentage < 25) {
    return '踏上征程，勇往直前'
  } else if (percentage < 50) {
    return '征途过半，继续前行'
  } else if (percentage < 75) {
    return '胜利在望，坚持不懈'
  } else if (percentage < 100) {
    return '即将到达，最后冲刺'
  } else {
    return '长征胜利，革命成功！'
  }
}

/**
 * 切换视图模式
 */
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'card' : 'list'
}

/**
 * 切换排序顺序
 */
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

/**
 * 切换筛选栏收缩状态
 */
const toggleFilterCollapse = () => {
  isFilterCollapsed.value = !isFilterCollapsed.value
}

/**
 * 获取筛选器计数
 */
const getFilterCount = (filterKey) => {
  return nodes.value.filter(node => {
    switch (filterKey) {
      case 'visited':
        return isNodeVisited(node.id)
      case 'unvisited':
        return !isNodeVisited(node.id)
      case 'current':
        return isCurrentNode(node.id)
      case 'battle':
      case 'meeting':
      case 'crossing':
      case 'mountain':
        return node.tags && node.tags.includes(filterKey)
      default:
        return false
    }
  }).length
}

/**
 * 显示节点详情
 */
const showNodeDetails = (node) => {
  selectedNode.value = node
  showNodeDetail.value = true
}

/**
 * 关闭节点详情
 */
const closeNodeDetail = () => {
  showNodeDetail.value = false
  selectedNode.value = null
}

/**
 * 获取节点标签
 * @param {Object} node - 节点对象
 * @returns {Array} 标签数组
 */
const getNodeTags = (node) => {
  if (!node) return []

  const tags = []

  // 根据节点名称生成标签
  if (node.name_zh || node.name) {
    const name = node.name_zh || node.name
    if (name.includes('战役') || name.includes('战斗')) tags.push('战斗')
    if (name.includes('会议') || name.includes('会师')) tags.push('会议')
    if (name.includes('渡') || name.includes('江') || name.includes('河')) tags.push('渡河')
    if (name.includes('山') || name.includes('岭') || name.includes('峰')) tags.push('翻山')
    if (name.includes('出发') || name.includes('开始')) tags.push('起点')
    if (name.includes('到达') || name.includes('结束')) tags.push('终点')
  }

  // 根据时间生成标签
  if (node.time_zh || node.time) {
    const time = node.time_zh || node.time
    if (time.includes('1934')) tags.push('1934年')
    if (time.includes('1935')) tags.push('1935年')
    if (time.includes('1936')) tags.push('1936年')
  }

  // 如果没有生成任何标签，添加默认标签
  if (tags.length === 0) {
    tags.push('长征节点')
  }

  return tags
}

/**
 * 获取节点完成度
 */
const getNodeCompletionRate = (node) => {
  // 基于节点的各种属性计算完成度
  let completion = 0
  if (isNodeVisited(node.id)) completion += 40
  if (hasNodeStory(node.id)) completion += 30
  if (node.poem_zh || node.poem) completion += 20
  if (getNodeTags(node).length > 0) completion += 10
  return Math.min(completion, 100)
}

// 监听进度变化
watch(
  () => progressStore.currentNodeId,
  () => {
    // 当前节点变化时可以执行一些操作
  }
)

watch(
  () => progressStore.visited,
  () => {
    // 访问节点变化时可以执行一些操作
  },
  { deep: true }
)

// 生命周期
onMounted(() => {
  loadNodes()
})

// 暴露方法给父组件
defineExpose({
  loadNodes,
  selectNode,
  flyToNode,
  nodes: () => nodes.value
})
</script>

<style scoped>
.node-list-container {
  font-family: 'Inter', sans-serif;
}

.node-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 卡片视图样式 */
.node-card {
  transition: all 0.2s ease;
}

.node-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 完成度进度条动画 */
@keyframes progressFill {
  from {
    width: 0;
  }

  to {
    width: var(--progress-width);
  }
}

/* 文本截断样式 */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式网格调整 */
@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }

  .node-card {
    margin-bottom: 1rem;
  }
}

/* 节点详情面板动画 */
.fixed.inset-0 {
  animation: fadeIn 0.2s ease-out;
}

.fixed.inset-0>div {
  animation: slideUp 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 筛选器按钮动画 */
.transition-all.duration-200 {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 悬停效果增强 */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\:text-primary {
  color: var(--color-primary, #3b82f6);
}

/* 加载状态样式 */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}
</style>