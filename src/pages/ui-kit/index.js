import React from 'react';
import Button from '@/components/Button/index.tsx';
import SectionHeader from '@/components/SectionHeader';
import ColorSwatch from '@/components/ColorSwatch';
import Card from '@/components/Card';
import Input from '@/components/Input';
import SearchInput from '@/components/SearchInput';
import Checkbox from '@/components/Checkbox';
import Switch from '@/components/Switch';

const UiKit = () => {
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
                        {/* Standard Job Card */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-lg hover:border-primary/50 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        <span className="material-icons-round text-2xl">code</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 dark:text-white text-lg group-hover:text-primary transition-colors font-heading">
                                            Senior Frontend Engineer
                                        </h3>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">TechCorp Inc.</p>
                                    </div>
                                </div>
                                <button className="text-neutral-400 hover:text-primary transition-colors">
                                    <span className="material-icons-round">bookmark_border</span>
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-medium">Remote</span>
                                <span className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-medium">Full-time</span>
                                <span className="px-2.5 py-1 rounded bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-medium">Senior Level</span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-700">
                                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                    $120k - $160k
                                    <span className="text-neutral-400 font-normal ml-1 text-xs">/ year</span>
                                </div>
                                <span className="text-xs text-neutral-400">Posted 2d ago</span>
                            </div>
                        </div>

                        {/* Featured Job Card */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border-2 border-primary/20 p-6 hover:shadow-lg hover:border-primary transition-all duration-300 group cursor-pointer relative">
                            <div className="absolute -top-3 left-6 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                                Featured
                            </div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                                        <span className="material-icons-round text-2xl">design_services</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 dark:text-white text-lg group-hover:text-primary transition-colors font-heading">
                                            Product Designer
                                        </h3>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">DesignStudio</p>
                                    </div>
                                </div>
                                <button className="text-neutral-400 hover:text-primary transition-colors">
                                    <span className="material-icons-round">bookmark_border</span>
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-medium">New York, NY</span>
                                <span className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-medium">Contract</span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-700">
                                <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                                    $80 - $120
                                    <span className="text-neutral-400 font-normal ml-1 text-xs">/ hour</span>
                                </div>
                                <button className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                                    Apply Now
                                </button>
                            </div>
                        </div>

                        {/* Compact Job Card */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-neutral-200 dark:border-neutral-700 p-5 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors flex flex-col justify-center h-full">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 text-sm font-bold">
                                    N
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-neutral-900 dark:text-white text-base font-heading">Backend Developer</h4>
                                    <p className="text-xs text-neutral-500">NexusAI • Remote</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-auto">
                                <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-medium border border-neutral-200 dark:border-neutral-700">Python</span>
                                <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-medium border border-neutral-200 dark:border-neutral-700">Django</span>
                                <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[10px] font-medium border border-neutral-200 dark:border-neutral-700">AWS</span>
                            </div>
                        </div>
                    </div>
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