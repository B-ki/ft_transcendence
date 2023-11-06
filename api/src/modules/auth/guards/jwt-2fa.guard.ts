import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
<<<<<<< HEAD
export class JwtTwoFaAuthGuard extends AuthGuard('jwt-2fa') {}
=======
export class Jwt2faAuthGuard extends AuthGuard('jwt-2fa') {}
>>>>>>> 475bf61 (Starting 2FA)
