import React, { useState } from 'react';
import Button from '@/components/Button';
import SectionHeader from '@/components/SectionHeader';
import ColorSwatch from '@/components/ColorSwatch';
import Card from '@/components/Card';
import Input from '@/components/Input';
import SearchInput from '@/components/SearchInput';
import Checkbox from '@/components/Checkbox';
import Switch from '@/components/Switch';
import JobCard from '@/components/JobCard';
import SimpleTextEditor from '@/components/SimpleTextEditor';

const UiKit = () => {
    const templateHtml = `
        <ul>
            <li><strong>Description:</strong> Write a short description of your project</li>
            <li><strong>Role:</strong> Your role in this project</li>
            <li>
                <strong>Responsibilities:</strong>
                <ul>
                    <li>First responsibility</li>
                    <li>Second responsibility</li>
                </ul>
            </li>
            <li><strong>Tech stack:</strong> List technologies used</li>
            <li><strong>Team size:</strong> x members</li>
        </ul>
    `;
    const insertHtml = `
        <p><strong>Everything in Free, plus</strong></p>
        <ul>
            <li>50 AI Resume scans/mo</li>
            <li>Priority Application</li>
            <li>AI Interview Coaching</li>
        </ul>
        <p><strong>What's included</strong></p>
        <ul>
            <li>3 AI Resume scans/mo</li>
            <li>Basic Job Search</li>
            <li>Public Profile</li>
        </ul>
    `;
    const [editorValue, setEditorValue] = useState(templateHtml);

    return (
        <div className="min-h-screen bg-surface-light dark:bg-background-dark">
            <header className="text-center max-w-3xl mx-auto py-16 px-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
                    Design System
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-neutral-900 dark:text-white font-heading">
                    SmartRecruit Design System
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-body">
                    A comprehensive collection of reusable components, styles, and guidelines for the SmartRecruit IT recruitment platform.
                </p>
            </header>

            <main className="pb-20 px-6 max-w-7xl mx-auto space-y-24">
                {/* 01. Color Palette */}
                <section id="colors">
                    <SectionHeader number="01" title="Color Palette" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Primary Colors */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-neutral-900 dark:text-white text-sm uppercase tracking-wider mb-4">
                                Primary Colors
                            </h3>
                            <div className="space-y-4">
                                <ColorSwatch 
                                    hex="#FF6B35" 
                                    name="Primary Orange" 
                                    description="Brand Main" 
                                />
                                <ColorSwatch 
                                    hex="#E55A2B" 
                                    name="Primary Dark" 
                                    description="Hover State" 
                                />
                            </div>
                        </div>

                        {/* Dark & Text */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-neutral-900 dark:text-white text-sm uppercase tracking-wider mb-4">
                                Dark & Text
                            </h3>
                            <div className="space-y-4">
                                <ColorSwatch 
                                    hex="#111827" 
                                    name="Dark Grey" 
                                    description="Headings" 
                                />
                                <ColorSwatch 
                                    hex="#4B5563" 
                                    name="Body Grey" 
                                    description="Paragraphs" 
                                />
                            </div>
                        </div>

                        {/* Neutral Tones */}
                        <div className="space-y-3 lg:col-span-2">
                            <h3 className="font-semibold text-neutral-900 dark:text-white text-sm uppercase tracking-wider mb-4">
                                Neutral Tones
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                    { hex: '#F3F4F6', name: 'Surface' },
                                    { hex: '#E5E7EB', name: 'Border' },
                                    { hex: '#D1D5DB', name: 'Disabled' },
                                    { hex: '#9CA3AF', name: 'Icon' },
                                ].map((color) => (
                                    <div key={color.hex} className="space-y-2">
                                        <div 
                                            className="h-12 w-full rounded-lg border border-neutral-200"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        <div className="text-xs">
                                            <span className="font-bold block dark:text-white">{color.name}</span>
                                            <span className="text-neutral-500 font-mono">{color.hex}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 02. Typography */}
                <section id="typography">
                    <SectionHeader number="02" title="Typography" />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Font Family */}
                        <div className="space-y-8">
                            <div>
                                <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
                                    Heading Font
                                </span>
                                <p className="text-4xl font-bold text-neutral-900 dark:text-white font-heading">
                                    Roobert
                                </p>
                                <p className="text-neutral-500 mt-2 font-body">
                                    Used for headings and titles. A modern geometric sans-serif with personality.
                                </p>
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">
                                    Body Font
                                </span>
                                <p className="text-4xl font-bold text-neutral-900 dark:text-white font-body">
                                    Interdisplay
                                </p>
                                <p className="text-neutral-500 mt-2 font-body">
                                    Used for body text and UI elements. Clean and highly readable.
                                </p>
                            </div>

                            {/* Heading Sizes */}
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                                    <span className="w-24 text-xs text-neutral-400 font-mono shrink-0">Display XL</span>
                                    <div>
                                        <p className="text-6xl font-extrabold text-neutral-900 dark:text-white font-heading">H1 Headline</p>
                                        <p className="text-xs text-neutral-400 mt-1">Bold 60px / 1.1 Line Height</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                                    <span className="w-24 text-xs text-neutral-400 font-mono shrink-0">Heading L</span>
                                    <div>
                                        <p className="text-4xl font-bold text-neutral-900 dark:text-white font-heading">H2 Title</p>
                                        <p className="text-xs text-neutral-400 mt-1">Bold 36px / 1.2 Line Height</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                                    <span className="w-24 text-xs text-neutral-400 font-mono shrink-0">Heading M</span>
                                    <div>
                                        <p className="text-2xl font-bold text-neutral-900 dark:text-white font-heading">H3 Subtitle</p>
                                        <p className="text-xs text-neutral-400 mt-1">Bold 24px / 1.3 Line Height</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Body Text Examples */}
                        <Card>
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                                    <span className="w-24 text-xs text-neutral-400 font-mono shrink-0">Body Large</span>
                                    <div>
                                        <p className="text-lg text-neutral-600 dark:text-neutral-300 font-body">
                                            Talentora connects top-tier tech talent with innovative companies. This is the large body text used for introductions.
                                        </p>
                                        <p className="text-xs text-neutral-400 mt-1">Regular 18px</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                                    <span className="w-24 text-xs text-neutral-400 font-mono shrink-0">Body Base</span>
                                    <div>
                                        <p className="text-base text-neutral-600 dark:text-neutral-300 font-body">
                                            Standard body text for the majority of the content. Good readability is key.
                                        </p>
                                        <p className="text-xs text-neutral-400 mt-1">Regular 16px</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                                    <span className="w-24 text-xs text-neutral-400 font-mono shrink-0">Caption</span>
                                    <div>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-body">
                                            Helper text, metadata, and captions.
                                        </p>
                                        <p className="text-xs text-neutral-400 mt-1">Medium 14px</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                                    <span className="w-24 text-xs text-neutral-400 font-mono shrink-0">Small</span>
                                    <div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
                                            Labels & Tags
                                        </p>
                                        <p className="text-xs text-neutral-400 mt-1">Semibold 12px</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* 03. Buttons */}
                <section id="buttons">
                    <SectionHeader number="03" title="Buttons & Actions" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Primary Actions */}
                        <Card title="Primary Actions">
                            <div className="flex flex-col gap-4 items-start">
                                <Button mode="primary">
                                    Primary Button
                                </Button>
                                <Button 
                                    mode="primary" 
                                    iconLeft={<span className="material-icons-round text-base">add</span>}
                                >
                                    With Icon
                                </Button>
                                <Button mode="primary" fullWidth disabled>
                                    Disabled State
                                </Button>
                            </div>
                        </Card>

                        {/* Secondary Actions */}
                        <Card title="Secondary Actions">
                            <div className="flex flex-col gap-4 items-start">
                                <Button mode="secondary">
                                    Secondary Button
                                </Button>
                                <Button 
                                    mode="secondary"
                                    iconLeft={<span className="material-icons-round text-base">filter_list</span>}
                                >
                                    Filter
                                </Button>
                                <Button mode="secondary" fullWidth disabled>
                                    Disabled
                                </Button>
                            </div>
                        </Card>

                        {/* Ghost & Sizes */}
                        <Card title="Ghost & Sizes">
                            <div className="flex flex-col gap-4 items-start">
                                <Button mode="ghost" shape="rounded">
                                    Ghost Button
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Button mode="primary" size="sm">
                                        Small
                                    </Button>
                                    <Button mode="primary" size="lg">
                                        Large
                                    </Button>
                                </div>
                                <button className="text-primary font-semibold hover:underline inline-flex items-center gap-1 text-sm bg-transparent border-0 cursor-pointer p-0">
                                    Text Link 
                                    <span className="material-icons-round text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* 04. Form Elements */}
                <section id="forms">
                    <SectionHeader number="04" title="Form Elements" />
                    
                    <Card className="!p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <Input
                                    label="Default Input"
                                    placeholder="Type something..."
                                />
                                <Input
                                    label="Input with Icon"
                                    type="email"
                                    placeholder="name@smartrecruit.com"
                                    prefix={<span className="material-icons-round text-neutral-400 text-xl">mail_outline</span>}
                                />
                                <Input
                                    label="Error State"
                                    placeholder="Error input"
                                    error={true}
                                    helperText={<><span className="font-medium">Oops!</span> Username is already taken.</>}
                                />
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <Input.Password
                                    label="Password Input"
                                    placeholder="Enter your password"
                                />
                                <Input.TextArea
                                    label="Text Area"
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                />
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">
                                        Search Bar
                                    </label>
                                    <SearchInput
                                        placeholder="Search for jobs, skills..."
                                        size="sm"
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-6 mt-4 pt-4">
                                    <Checkbox
                                        id="checkbox1"
                                        label="Remember me"
                                    />
                                    <Checkbox
                                        id="checkbox2"
                                        label="Checked"
                                        defaultChecked
                                    />
                                    <Switch
                                        id="switch1"
                                        label="Toggle"
                                        defaultChecked
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* 05. Job Cards */}
                <section id="cards">
                    <SectionHeader number="05" title="Job Card Component" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Hot Job Card */}
                        <JobCard
                            title="Senior UX/UI Designer"
                            company="TechFlow Systems"
                            location="San Francisco, CA (Remote)"
                            salary="$110k - $140k/yr"
                            tags={['Full-time', 'React', 'Figma', 'Mid-Level']}
                            postedTime="3h ago"
                            isHot={true}
                            companyLogo="https://lh3.googleusercontent.com/aida-public/AB6AXuASs1kam8Zm-9wgV7a1UuN933U9Dd-eS1mrzcCHt3Cl2D4QrO5aaAqzRWERdSuGcasBFTSeYGQ59uWH6HA35yFjoNa4dQnUcQi_-0b1MgXdjqp1XuD0thYZUJS1WrTClq4JDjiKYxvCnoPYmQuyl3tkTJUtvVr6z154nu2-h0LFlG9VIboEGgprJXZnddQOzYeEz-po9imG0x84b9_ZHc8yaSOjtDIUYKQQMnC8UiMYhFnXtGxuTJWXrak6GxfyzxI-zSx6zZbRxDU"
                            variant="primary"
                            onBookmark={() => console.log('Bookmarked')}
                            onApply={() => console.log('Applied')}
                        />

                        {/* Secondary Job Card */}
                        <JobCard
                            title="Backend Engineer"
                            company="Nebula Corp"
                            location="Austin, TX (Hybrid)"
                            salary="$130k - $160k/yr"
                            tags={['Go', 'PostgreSQL']}
                            postedTime="1d ago"
                            companyLogo="https://lh3.googleusercontent.com/aida-public/AB6AXuDlGPyk9Str7aKT5PXOqo1nSq7OqQ50U0WjM5T8QSoxMgVuzJ1mX5Mw1nuPz2HoJFUyq3mqp1uGXSkncgyfB-o1_XT_Z-7ctxeOQDr7KiKwiJp60tnFYFuTZpYsHiv8krSpU_K6wwbPq_PWMv5lKP2i14feB3TSzGE8Sinh0mUqPaCuw8Bx9SPbiZsOPbNQRudlpQUFFYbOYYVWhZpuwi87uEedLMQ8yWh8m24-d_elMghXIBTesp3LZtlpoupcfse4jANxDoPsr9Y"
                            variant="secondary"
                            onBookmark={() => console.log('Bookmarked')}
                            onApply={() => console.log('View Details')}
                        />

                        {/* Another Job Card */}
                        <JobCard
                            title="Frontend Developer"
                            company="StartupXYZ"
                            location="New York, NY (On-site)"
                            salary="$90k - $120k/yr"
                            tags={['React', 'TypeScript', 'Tailwind']}
                            postedTime="2d ago"
                            variant="primary"
                            onBookmark={() => console.log('Bookmarked')}
                            onApply={() => console.log('Applied')}
                        />
                    </div>
                </section>

                {/* 06. Text Editor */}
                <section id="text-editor">
                    <SectionHeader number="06" title="Text Editor" />

                    <Card className="!p-8">
                        <SimpleTextEditor
                            value={editorValue}
                            onChange={(html) => setEditorValue(html)}
                            bulletLevelMap={['check_circle_orange', 'check_orange']}
                            showInsertHtml
                            insertHtml={insertHtml}
                            insertHtmlLabel="Insert HTML"
                            showInsertTemplate
                            templateHtml={templateHtml}
                            onInsertTemplate={() => setEditorValue(templateHtml)}
                            showCount
                            maxLength={2500}
                            placeholder="Write your project details..."
                        />
                    </Card>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-surface-dark border-t border-neutral-200 dark:border-neutral-800 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <button className="flex items-center gap-2 group mb-2 bg-transparent border-0 cursor-pointer p-0">
                            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white">
                                <span className="material-icons-round text-sm">palette</span>
                            </div>
                            <span className="font-bold text-neutral-900 dark:text-white tracking-tight font-heading">
                                Talentora Design System
                            </span>
                        </button>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Maintained by the Design Team. Updated Jan 2026.
                        </p>
                    </div>
                    <div className="flex gap-6 text-sm text-neutral-500 dark:text-neutral-400">
                        <button className="hover:text-primary transition-colors bg-transparent border-0 cursor-pointer p-0">Documentation</button>
                        <button className="hover:text-primary transition-colors bg-transparent border-0 cursor-pointer p-0">Components</button>
                        <button className="hover:text-primary transition-colors bg-transparent border-0 cursor-pointer p-0">Brand Assets</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UiKit;
