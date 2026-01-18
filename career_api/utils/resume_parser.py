"""
Resume Parser - Extract structured data from resume text
"""
const API_URL = import.meta.env.VITE_API_URL;
import re
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)


def clean_line(line: str) -> str:
    """Clean and normalize a line of text for better parsing."""
    line = re.sub(r'\s+', ' ', line)
    line = re.sub(r'[^\w\s\.\-\+\&\@\#\(\)]', '', line)
    return line.strip()


def is_section_header(line: str) -> bool:
    """Determine if a line is likely a section header."""
    line_clean = line.strip()
    
    section_headers = {
        'education', 'experience', 'skills', 'projects', 'work', 'employment',
        'academic', 'qualifications', 'certifications', 'languages', 'interests',
        'achievements', 'awards', 'publications', 'references', 'contact',
        'summary', 'objective', 'profile', 'technical skills', 'professional experience'
    }
    
    if line_clean.lower() in section_headers:
        return True
    
    if len(line_clean.split()) <= 4:
        if line_clean.isupper() or re.match(r'^[A-Z][A-Z\s]+$', line_clean):
            return True
    
    return False


def extract_section_simple(lines: List[str], section_name: str) -> List[str]:
    """Simple section extraction that looks for exact section names."""
    section = []
    found_section = False
    
    variations = [
        section_name.upper(),
        section_name.title(),
        section_name.lower(),
        f"{section_name.upper()}S",
        f"{section_name.title()}S"
    ]
    
    for line in lines:
        line_clean = line.strip()
        
        if any(var in line_clean for var in variations):
            found_section = True
            continue
        
        if found_section:
            if is_section_header(line):
                break
            if line_clean:
                section.append(line_clean)
    
    return section


def extract_section_advanced(lines: List[str], section_keywords: List[str]) -> List[str]:
    """Advanced section extraction that handles multiple keyword variations."""
    section = []
    found_section = False
    
    for i, line in enumerate(lines):
        line_lower = line.lower().strip()
        
        if any(keyword in line_lower for keyword in section_keywords):
            found_section = True
            continue
        
        if found_section:
            if is_section_header(line):
                break
            if line.strip():
                section.append(line.strip())
    
    return [clean_line(line) for line in section if line.strip()]


def extract_contact_info(text: str) -> Dict[str, str]:
    """Extract contact information from resume text."""
    contact_info = {}
    
    # Email pattern
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    email_match = re.search(email_pattern, text)
    if email_match:
        contact_info['email'] = email_match.group()
    
    # Phone patterns
    phone_patterns = [
        r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b',  # US format
        r'\+\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}\b',  # International
        r'\b\d{10}\b',  # 10 digits
    ]
    
    for pattern in phone_patterns:
        phone_match = re.search(pattern, text)
        if phone_match:
            contact_info['phone'] = phone_match.group()
            break
    
    # LinkedIn
    linkedin_pattern = r'linkedin\.com/in/[A-Za-z0-9-]+'
    linkedin_match = re.search(linkedin_pattern, text)
    if linkedin_match:
        contact_info['linkedin'] = linkedin_match.group()
    
    # GitHub
    github_pattern = r'github\.com/[A-Za-z0-9-]+'
    github_match = re.search(github_pattern, text)
    if github_match:
        contact_info['github'] = github_match.group()
    
    return contact_info


def extract_skills_from_text(text: str) -> List[str]:
    """Extract skills from skills section text."""
    skills = []
    
    # Common tech skills to look for
    common_skills = [
        'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'go', 'rust', 'php', 'swift', 'kotlin',
        'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'rails',
        'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'firebase',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'git', 'github', 'gitlab',
        'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
        'data analysis', 'data visualization', 'tableau', 'power bi', 'excel',
        'agile', 'scrum', 'jira', 'confluence', 'rest api', 'graphql', 'microservices',
        'linux', 'unix', 'bash', 'powershell', 'networking', 'security',
        'figma', 'adobe', 'photoshop', 'illustrator', 'ui/ux', 'responsive design'
    ]
    
    text_lower = text.lower()
    
    for skill in common_skills:
        if skill in text_lower:
            skills.append(skill.title() if len(skill) > 3 else skill.upper())
    
    # Also extract from comma-separated lists
    bullet_sections = text.split('•')
    for section in bullet_sections:
        if ':' in section:
            _, skills_list = section.split(':', 1)
            parts = [p.strip() for p in skills_list.split(',') if p.strip()]
            for part in parts:
                cleaned = clean_skill(part)
                if cleaned and len(cleaned) > 1 and cleaned not in skills:
                    skills.append(cleaned)
    
    return list(dict.fromkeys(skills))  # Remove duplicates


def clean_skill(skill: str) -> str:
    """Clean and normalize a skill term."""
    skill = re.sub(r'^(and|or|&)\s+', '', skill, flags=re.IGNORECASE)
    skill = re.sub(r'\s+(and|or|&)$', '', skill, flags=re.IGNORECASE)
    skill = re.sub(r'\s+\d+\.?\d*', '', skill)
    skill = re.sub(r'\s+', ' ', skill).strip()
    return skill


def extract_skills_advanced(skill_lines: List[str]) -> List[str]:
    """Advanced skill extraction with better handling of various formats."""
    skills = set()
    
    for line in skill_lines:
        if ':' in line:
            line = line.split(':', 1)[1]
        
        separators = [',', ';', '|', '•', '·']
        
        for sep in separators:
            if sep in line:
                parts = [part.strip() for part in line.split(sep) if part.strip()]
                skills.update(parts)
                break
        else:
            words = line.split()
            if len(words) <= 3:
                skills.add(line.strip())
    
    cleaned_skills = []
    for skill in skills:
        skill_clean = clean_skill(skill)
        if skill_clean and len(skill_clean) > 1:
            cleaned_skills.append(skill_clean)
    
    return list(dict.fromkeys(cleaned_skills))


def parse_resume_single_line(raw_text: str) -> Dict:
    """Specialized parser for resumes extracted as single line."""
    contact_info = extract_contact_info(raw_text)
    
    patterns = {
        'education': r'EDUCATION\s+(.*?)(?=SKILLS|PROJECTS|CERTIFICATIONS|ACHIEVEMENTS|EXPERIENCE|$)',
        'skills': r'SKILLS\s+(.*?)(?=PROJECTS|CERTIFICATIONS|ACHIEVEMENTS|EXPERIENCE|$)',
        'projects': r'PROJECTS\s+(.*?)(?=CERTIFICATIONS|ACHIEVEMENTS|EXPERIENCE|$)',
        'experience': r'EXPERIENCE\s+(.*?)(?=EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|$)',
        'certifications': r'CERTIFICATIONS\s+(.*?)(?=ACHIEVEMENTS|$)',
        'achievements': r'ACHIEVEMENTS\s+(.*?)$'
    }
    
    parsed_data = {
        'contact': contact_info,
        'education': [],
        'experience': [],
        'projects': [],
        'skills': [],
        'certifications': [],
        'achievements': [],
        'raw_text': raw_text
    }
    
    for section_name, pattern in patterns.items():
        match = re.search(pattern, raw_text, re.IGNORECASE | re.DOTALL)
        if match:
            section_content = match.group(1).strip()
            
            if section_name == 'skills':
                parsed_data[section_name] = extract_skills_from_text(section_content)
            else:
                items = [item.strip() for item in section_content.split('•') if item.strip()]
                parsed_data[section_name] = items
    
    # Also try to extract skills from full text if section parsing didn't find enough
    if len(parsed_data['skills']) < 5:
        additional_skills = extract_skills_from_text(raw_text)
        for skill in additional_skills:
            if skill not in parsed_data['skills']:
                parsed_data['skills'].append(skill)
    
    parsed_data['metadata'] = {
        'total_characters': len(raw_text),
        'sections_found': [k for k, v in parsed_data.items() if v and k not in ['contact', 'raw_text', 'metadata']],
        'contact_info_found': bool(contact_info)
    }
    
    return parsed_data


def parse_resume_enhanced(raw_text: str) -> Dict:
    """Enhanced resume parsing with better section detection and data extraction."""
    lines = raw_text.split('\n')
    if len(lines) <= 3:
        return parse_resume_single_line(raw_text)
    
    lines = [line.strip() for line in raw_text.split('\n') if line.strip()]
    
    contact_info = extract_contact_info(raw_text)
    
    education = extract_section_simple(lines, "EDUCATION")
    experience = extract_section_simple(lines, "EXPERIENCE")
    projects = extract_section_simple(lines, "PROJECTS")
    skills_section = extract_section_simple(lines, "SKILLS")
    
    if not education:
        education = extract_section_advanced(lines, ['education', 'academic', 'qualifications', 'degree', 'university', 'college'])
    
    if not experience:
        experience = extract_section_advanced(lines, ['experience', 'work', 'employment', 'career', 'professional'])
    
    if not projects:
        projects = extract_section_advanced(lines, ['projects', 'project', 'portfolio', 'works'])
    
    if not skills_section:
        skills_section = extract_section_advanced(lines, ['skills', 'technical skills', 'technologies', 'programming', 'tools'])
    
    skills = extract_skills_advanced(skills_section)
    
    # Also extract from full text
    if len(skills) < 5:
        additional_skills = extract_skills_from_text(raw_text)
        for skill in additional_skills:
            if skill not in skills:
                skills.append(skill)
    
    parsed_data = {
        'contact': contact_info,
        'education': education,
        'experience': experience,
        'projects': projects,
        'skills': skills,
        'raw_text': raw_text
    }
    
    parsed_data['metadata'] = {
        'total_lines': len(lines),
        'sections_found': [k for k, v in {'education': education, 'experience': experience, 'projects': projects, 'skills': skills}.items() if v],
        'contact_info_found': bool(contact_info)
    }
    
    logger.info(f"Parsed resume with {len(skills)} skills, {len(projects)} projects, {len(education)} education entries")
    
    return parsed_data


def parse_resume(raw_text: str) -> Dict:
    """Main resume parsing function."""
    return parse_resume_enhanced(raw_text)


def analyze_resume_quality(parsed_data: Dict) -> Dict:
    """Analyze the quality and completeness of parsed resume data."""
    analysis = {
        'completeness_score': 0,
        'missing_sections': [],
        'recommendations': [],
        'strengths': []
    }
    
    total_sections = 4
    found_sections = 0
    
    if parsed_data.get('education'):
        found_sections += 1
        analysis['strengths'].append('Education information found')
    else:
        analysis['missing_sections'].append('Education')
    
    if parsed_data.get('experience'):
        found_sections += 1
        analysis['strengths'].append('Work experience found')
    else:
        analysis['missing_sections'].append('Experience')
    
    if parsed_data.get('projects'):
        found_sections += 1
        analysis['strengths'].append('Project portfolio found')
    else:
        analysis['missing_sections'].append('Projects')
    
    skills_count = len(parsed_data.get('skills', []))
    if skills_count > 0:
        found_sections += 1
        analysis['strengths'].append(f'{skills_count} skills identified')
    else:
        analysis['missing_sections'].append('Skills')
    
    analysis['completeness_score'] = round((found_sections / total_sections) * 100)
    
    if analysis['completeness_score'] < 75:
        analysis['recommendations'].append('Add missing sections to improve resume completeness')
    
    if skills_count < 5:
        analysis['recommendations'].append('Add more technical skills to showcase your capabilities')
    
    if len(parsed_data.get('projects', [])) < 2:
        analysis['recommendations'].append('Include more projects to demonstrate practical experience')
    
    if not parsed_data.get('contact', {}).get('email'):
        analysis['recommendations'].append('Ensure your email is clearly visible on your resume')
    
    return analysis
