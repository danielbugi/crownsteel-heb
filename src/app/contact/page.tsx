'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '@/contexts/settings-context';
import { HeroSection } from '@/components/layout/hero-section';

export default function ContactPage() {
  const { language } = useLanguage();
  const { settings } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      toast.success(
        language === 'he'
          ? 'ההודעה נשלחה בהצלחה! נחזור אליך בקרוב'
          : "Message sent successfully! We'll get back to you soon"
      );

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error(
        language === 'he'
          ? 'שגיאה בשליחת ההודעה. נסה שוב מאוחר יותר'
          : 'Failed to send message. Please try again later'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      labelEn: 'Email',
      labelHe: 'דוא"ל',
      value: settings?.contactEmail || 'contact@forgesteel.com',
      href: `mailto:${settings?.contactEmail || 'contact@forgesteel.com'}`,
    },
    {
      icon: Phone,
      labelEn: 'Phone',
      labelHe: 'טלפון',
      value: settings?.contactPhone || '+972-50-123-4567',
      href: `tel:${settings?.contactPhone || '+972501234567'}`,
    },
    {
      icon: MapPin,
      labelEn: 'Address',
      labelHe: 'כתובת',
      value: settings?.address || '123 Main Street, Tel Aviv, Israel',
      href: null,
    },
    {
      icon: Clock,
      labelEn: 'Hours',
      labelHe: 'שעות פתיחה',
      value:
        language === 'he'
          ? 'ראשון - חמישי: 9:00 - 18:00'
          : 'Sun - Thu: 9:00 AM - 6:00 PM',
      href: null,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        title={language === 'he' ? 'צור קשר' : 'Contact Us'}
        description={
          language === 'he'
            ? 'יש לך שאלה? רוצה לקבוע פגישה? נשמח לעזור!'
            : "Have a question? Want to schedule an appointment? We're here to help!"
        }
        size="lg"
      />

      {/* Contact Content */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">
                {language === 'he' ? 'פרטי התקשרות' : 'Contact Information'}
              </h2>
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                const content = (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4 rtl:space-x-reverse">
                        <div className="p-2 bg-accent rounded-lg">
                          <Icon className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">
                            {language === 'he' ? info.labelHe : info.labelEn}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {info.value}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );

                return info.href ? (
                  <a
                    key={index}
                    href={info.href}
                    className="block hover:scale-105 transition-transform"
                  >
                    {content}
                  </a>
                ) : (
                  content
                );
              })}

              {/* Map Placeholder */}
              <Card>
                <CardContent className="pt-6">
                  <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    {language === 'he'
                      ? 'בקר באולם התצוגה שלנו'
                      : 'Visit our showroom'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'he' ? 'שלח לנו הודעה' : 'Send us a Message'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          {language === 'he' ? 'שם מלא' : 'Full Name'}{' '}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder={
                            language === 'he' ? 'ישראל ישראלי' : 'John Doe'
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          {language === 'he' ? 'דוא"ל' : 'Email'}{' '}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder={
                            language === 'he'
                              ? 'example@email.com'
                              : 'john@example.com'
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          {language === 'he' ? 'טלפון' : 'Phone'}
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder={
                            language === 'he'
                              ? '050-123-4567'
                              : '+972-50-123-4567'
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">
                          {language === 'he' ? 'נושא' : 'Subject'}{' '}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder={
                            language === 'he'
                              ? 'איך אוכל לעזור?'
                              : 'How can we help?'
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">
                        {language === 'he' ? 'הודעה' : 'Message'}{' '}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder={
                          language === 'he'
                            ? 'כתוב את ההודעה שלך כאן...'
                            : 'Write your message here...'
                        }
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} size="lg">
                      {isSubmitting
                        ? language === 'he'
                          ? 'שולח...'
                          : 'Sending...'
                        : language === 'he'
                          ? 'שלח הודעה'
                          : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
