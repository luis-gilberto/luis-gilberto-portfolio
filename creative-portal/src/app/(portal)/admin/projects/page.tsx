import React from 'react';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ProjectsClient from './ProjectsClient';

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  
  let authorityLevel = 0;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { authorityLevel: true }
    });
    authorityLevel = user?.authorityLevel || 0;
  }

  const projects = await prisma.project.findMany({
    include: { client: true },
    orderBy: { startDate: 'desc' }
  });

  return (
    <ProjectsClient 
      projects={projects} 
      authorityLevel={authorityLevel} 
    />
  );
}
