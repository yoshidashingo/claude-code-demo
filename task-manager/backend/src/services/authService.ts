import bcrypt from 'bcrypt';
import { prisma } from '../config/database';
import { generateToken } from '../utils/jwt';
import { logger } from '../utils/logger';

export class AuthService {
  async register(email: string, password: string) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });
    
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });
    
    logger.info('User registered:', user.email);
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
  
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });
    
    logger.info('User logged in:', user.email);
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
  
  async getUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
}

export const authService = new AuthService();