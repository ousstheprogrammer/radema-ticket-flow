import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Shield, ShieldCheck, ShieldX, Eye, EyeOff, Fingerprint, ScanFace } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    username: '', 
    fullName: '',
    profession: ''
  });

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    const password = signupData.password;
    if (!password) return { score: 0, feedback: '', color: 'bg-gray-200' };

    let score = 0;
    const feedback = [];

    // Length check
    if (password.length >= 8) {
      score += 25;
    } else {
      feedback.push('Au moins 8 caractères');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 25;
    } else {
      feedback.push('Une majuscule');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 25;
    } else {
      feedback.push('Une minuscule');
    }

    // Number or special character check
    if (/[\d\W]/.test(password)) {
      score += 25;
    } else {
      feedback.push('Un chiffre ou caractère spécial');
    }

    let strengthText = '';
    let color = '';
    let icon = ShieldX;

    if (score <= 25) {
      strengthText = 'Très faible';
      color = 'bg-red-500';
      icon = ShieldX;
    } else if (score <= 50) {
      strengthText = 'Faible';
      color = 'bg-orange-500';
      icon = Shield;
    } else if (score <= 75) {
      strengthText = 'Moyen';
      color = 'bg-yellow-500';
      icon = Shield;
    } else {
      strengthText = 'Fort';
      color = 'bg-green-500';
      icon = ShieldCheck;
    }

    return {
      score,
      feedback: feedback.length > 0 ? `Manque: ${feedback.join(', ')}` : 'Excellent!',
      strengthText,
      color,
      icon
    };
  }, [signupData.password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Connexion réussie!');
        onAuthSuccess();
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.email || !signupData.password || !signupData.confirmPassword) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (signupData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username: signupData.username,
            full_name: signupData.fullName,
            profession: signupData.profession,
          }
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        if (data.user && !data.user.email_confirmed_at) {
          toast.success('Compte créé! Vérifiez votre email pour confirmer votre compte.', {
            description: 'Un lien de vérification a été envoyé à votre adresse email.',
            duration: 6000,
          });
        } else {
          toast.success('Compte créé avec succès!');
        }
      }
    } catch (error) {
      toast.error('Erreur lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error('Veuillez entrer votre adresse email');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Email de réinitialisation envoyé!', {
          description: 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe.',
          duration: 6000,
        });
        setShowResetPassword(false);
        setResetEmail('');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'email');
    } finally {
      setIsLoading(false);
    }
  };

  // Biometric authentication functions
  const handleBiometricLogin = async (useFingerprint = true) => {
    if (!window.PublicKeyCredential) {
      toast.error('Authentification biométrique non supportée par ce navigateur');
      return;
    }

    setIsLoading(true);
    try {
      // Check if biometric authentication is available
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        toast.error('Authentification biométrique non disponible sur cet appareil');
        setIsLoading(false);
        return;
      }

      // Generate a proper challenge
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const userId = crypto.getRandomValues(new Uint8Array(16));

      // Create credential request
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: challenge,
          rp: {
            name: "SRM Ticketing System",
            id: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname,
          },
          user: {
            id: userId,
            name: loginData.email || "user@example.com",
            displayName: "Utilisateur SRM",
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" },  // ES256
            { alg: -257, type: "public-key" } // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            requireResidentKey: false
          },
          timeout: 60000,
          attestation: "direct"
        }
      });

      if (credential) {
        toast.success('Authentification biométrique configurée avec succès!');
        
        // Store the credential for future use (in a real app, send to backend)
        localStorage.setItem('biometric_credential', JSON.stringify({
          id: credential.id,
          type: credential.type,
          email: loginData.email
        }));
        
        // Simulate successful login
        onAuthSuccess();
      }
    } catch (error: any) {
      console.error('Biometric authentication error:', error);
      
      if (error.name === 'NotAllowedError') {
        toast.error('Authentification biométrique refusée ou annulée');
      } else if (error.name === 'InvalidStateError') {
        toast.error('Authentification biométrique déjà configurée pour cet utilisateur');
      } else if (error.name === 'NotSupportedError') {
        toast.error('Type d\'authentification biométrique non supporté');
      } else if (error.name === 'SecurityError') {
        toast.error('Erreur de sécurité - vérifiez que vous êtes sur HTTPS');
      } else {
        toast.error(`Erreur d'authentification biométrique: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricVerification = async () => {
    if (!window.PublicKeyCredential) {
      toast.error('Authentification biométrique non supportée');
      return;
    }

    const storedCredential = localStorage.getItem('biometric_credential');
    if (!storedCredential) {
      toast.error('Aucune authentification biométrique configurée. Veuillez d\'abord vous inscrire.');
      return;
    }

    setIsLoading(true);
    try {
      const credentialData = JSON.parse(storedCredential);
      const challenge = crypto.getRandomValues(new Uint8Array(32));

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: challenge,
          rpId: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname,
          allowCredentials: [{
            id: new TextEncoder().encode(credentialData.id),
            type: "public-key"
          }],
          userVerification: "required",
          timeout: 60000
        }
      });

      if (assertion) {
        toast.success('Connexion biométrique réussie!');
        onAuthSuccess();
      }
    } catch (error: any) {
      console.error('Biometric verification error:', error);
      
      if (error.name === 'NotAllowedError') {
        toast.error('Authentification biométrique refusée');
      } else {
        toast.error(`Erreur de vérification: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFingerprintLogin = () => handleBiometricVerification();
  const handleFaceRecognitionLogin = () => handleBiometricVerification();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center space-y-3">
            <img 
              src="/lovable-uploads/afe13b00-8adc-4688-80c1-16bda30ba6d6.png" 
              alt="SRM Logo" 
              className="h-20 w-auto"
            />
            <CardTitle className="text-2xl font-bold">SRM</CardTitle>
            <CardDescription>Système de Ressources de Maintenance</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              {!showResetPassword ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                  
                  {/* Biometric Authentication Section */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Ou utilisez
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleFingerprintLogin}
                      disabled={isLoading}
                      className="flex items-center justify-center space-x-2 h-12 transition-all hover:bg-primary/10"
                      title="Connexion par empreinte digitale"
                    >
                      <Fingerprint size={20} />
                      <span className="hidden sm:inline">Empreinte</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleFaceRecognitionLogin}
                      disabled={isLoading}
                      className="flex items-center justify-center space-x-2 h-12 transition-all hover:bg-primary/10"
                      title="Connexion par reconnaissance faciale"
                    >
                      <ScanFace size={20} />
                      <span className="hidden sm:inline">Visage</span>
                    </Button>
                  </div>
                  
                  <div className="text-center text-xs text-muted-foreground">
                    <p>L'authentification biométrique nécessite HTTPS et un appareil compatible</p>
                  </div>
                  
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(true)}
                      className="text-sm text-primary hover:underline"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email pour réinitialisation</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      placeholder="Entrez votre adresse email"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
                  </Button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(false)}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      Retour à la connexion
                    </button>
                  </div>
                </form>
              )}
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email *</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    type="text"
                    value={signupData.username}
                    onChange={(e) => setSignupData(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    type="text"
                    placeholder="Ex: Technicien, Ingénieur, Maintenance..."
                    value={signupData.profession}
                    onChange={(e) => setSignupData(prev => ({ ...prev, profession: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe *</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {signupData.password && (
                    <div className="space-y-2 animate-fade-in">
                      <div className="flex items-center space-x-2">
                        <passwordStrength.icon 
                          size={16} 
                          className={`transition-colors duration-300 ${
                            passwordStrength.score <= 25 ? 'text-red-500' :
                            passwordStrength.score <= 50 ? 'text-orange-500' :
                            passwordStrength.score <= 75 ? 'text-yellow-500' :
                            'text-green-500'
                          }`}
                        />
                        <span className={`text-sm font-medium transition-colors duration-300 ${
                          passwordStrength.score <= 25 ? 'text-red-600' :
                          passwordStrength.score <= 50 ? 'text-orange-600' :
                          passwordStrength.score <= 75 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {passwordStrength.strengthText}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <Progress 
                          value={passwordStrength.score} 
                          className="h-2 transition-all duration-500 ease-out"
                        />
                        <p className={`text-xs transition-opacity duration-300 ${
                          passwordStrength.score <= 25 ? 'text-red-600' :
                          passwordStrength.score <= 50 ? 'text-orange-600' :
                          passwordStrength.score <= 75 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {passwordStrength.feedback}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe *</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  
                  {/* Password Match Indicator */}
                  {signupData.confirmPassword && (
                    <div className="animate-fade-in">
                      {signupData.password === signupData.confirmPassword ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <ShieldCheck size={14} />
                          <span className="text-xs">Les mots de passe correspondent</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-red-600">
                          <ShieldX size={14} />
                          <span className="text-xs">Les mots de passe ne correspondent pas</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Création...' : 'Créer un compte'}
                </Button>
                
                {/* Option to setup biometric after signup */}
                <div className="text-center pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleBiometricLogin()}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <Fingerprint size={16} />
                    <span>Configurer l'authentification biométrique</span>
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;