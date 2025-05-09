import { defineStore } from 'pinia'
import { createProject } from '@/api/project'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    currentProject: null,
  }),

  actions: {
    async submitProject(data) {
      try {
        const response = await createProject(data)
        const newProject = response.data
        this.projects.push(newProject)
        return newProject
      } catch (error) {
        console.error('新增專案失敗:', error)
        throw error
      }
    },
  },
})
