/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/auth/jwt-auth.guard.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
