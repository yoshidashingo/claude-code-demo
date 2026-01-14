import { Task, TaskStatus, Priority, Prisma } from '@prisma/client'
import { prisma } from '../utils/prisma'
import { CreateTaskDto, UpdateTaskDto, TaskQuery } from '../types/task.types'
import { NotFoundError } from '../utils/errors'

export class TaskService {
  async create(userId: string, data: CreateTaskDto): Promise<Task> {
    return prisma.task.create({
      data: {
        ...data,
        userId,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined
      }
    })
  }

  async findAll(userId: string, query: TaskQuery): Promise<{ tasks: Task[]; total: number }> {
    const {
      status,
      priority,
      categoryId,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = query

    const where: Prisma.TaskWhereInput = {
      userId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    }

    const orderBy: Prisma.TaskOrderByWithRelationInput = {}
    if (sortBy === 'priority') {
      orderBy.priority = order
    } else {
      orderBy[sortBy] = order
    }

    const skip = (page - 1) * limit

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      }),
      prisma.task.count({ where })
    ])

    return { tasks, total }
  }

  async findById(id: string, userId: string): Promise<Task> {
    const task = await prisma.task.findFirst({
      where: { id, userId },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!task) {
      throw new NotFoundError('Task')
    }

    return task
  }

  async update(id: string, userId: string, data: UpdateTaskDto): Promise<Task> {
    const task = await this.findById(id, userId)

    return prisma.task.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate !== undefined 
          ? (data.dueDate ? new Date(data.dueDate) : null)
          : undefined
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })
  }

  async updateStatus(id: string, userId: string, status: TaskStatus): Promise<Task> {
    const task = await this.findById(id, userId)

    return prisma.task.update({
      where: { id },
      data: { status },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId)
    await prisma.task.delete({ where: { id } })
  }

  async getStatistics(userId: string): Promise<any> {
    const [total, byStatus, byPriority] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.groupBy({
        by: ['status'],
        where: { userId },
        _count: { status: true }
      }),
      prisma.task.groupBy({
        by: ['priority'],
        where: { userId },
        _count: { priority: true }
      })
    ])

    return {
      total,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status.toLowerCase()] = item._count.status
        return acc
      }, {} as Record<string, number>),
      byPriority: byPriority.reduce((acc, item) => {
        acc[item.priority.toLowerCase()] = item._count.priority
        return acc
      }, {} as Record<string, number>)
    }
  }
}

export const taskService = new TaskService()