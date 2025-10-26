import { NextRequest, NextResponse } from 'next/server';
import { ZhipuAI } from 'zhipuai-sdk-nodejs-v4';

// 智谱AI客户端实例
const zhipuClient = new ZhipuAI({
  apiKey: process.env.ZHIPU_AI_API_KEY || '',
});

// 智谱AI建议生成器
const generateAISuggestions = async (task: string, persona: string): Promise<string[]> => {
  try {
    // 构建个性化的prompt
    const prompt = buildPersonalizedPrompt(task, persona);
    
    const response = await zhipuClient.createCompletions({
      model: "glm-4",
      messages: [
        {
          role: "system",
          content: "你是一个专业的体验设计师，擅长为不同人格特征的用户设计有趣的支线任务。请严格按照要求返回3个建议，每个建议一行，不要添加序号或其他格式。"
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      stream: false,
      temperature: 0.8,
      maxTokens: 500
    });

    // 检查 response 是否为 CompletionsResponseMessage 类型
    if (response && typeof response === 'object' && 'choices' in response && response.choices && response.choices[0] && response.choices[0].message) {
      const content = response.choices[0].message.content;
      // 解析返回的建议，按行分割并过滤空行
      const suggestions = content
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)
        .slice(0, 3); // 确保只返回3个建议
      
      return suggestions.length >= 3 ? suggestions : generateFallbackSuggestions(task, persona);
    }
    
    return generateFallbackSuggestions(task, persona);
  } catch (error) {
    console.warn('智谱AI调用失败，使用备用建议:', error);
    return generateFallbackSuggestions(task, persona);
  }
};

// 构建个性化prompt
const buildPersonalizedPrompt = (task: string, persona: string): string => {
  const personaDescriptions: Record<string, string> = {
    collector: "收集者 - 喜欢收集、整理和保存有意义的事物",
    competitor: "竞争者 - 喜欢挑战、比较和追求卓越",
    explorer: "探索者 - 喜欢发现新事物、尝试不同方法",
    creator: "创造者 - 喜欢创新、设计和制作独特的东西",
    storyteller: "故事讲述者 - 喜欢叙述、分享和创造故事",
    comedian: "幽默家 - 喜欢寻找乐趣、制造笑点",
    leader: "领导者 - 喜欢组织、规划和指导他人",
    mover: "行动者 - 喜欢身体活动和动态体验"
  };

  const personaDesc = personaDescriptions[persona] || "普通用户";
  
  return `任务："${task}"
人格特征：${personaDesc}

请为这个任务设计3个有趣的支线任务，让完成过程更加愉快。要求：
1. 每个建议都要符合该人格特征的偏好
2. 建议要简短、具体、可执行
3. 要有创意和趣味性
4. 严格返回3个建议，每行一个，不要序号

示例格式：
为这个任务创造一个专属的背景音乐
邀请朋友一起参与并记录过程
设计一个完成后的小小庆祝仪式`;
};

// 备用建议生成器（原模拟逻辑）
const generateFallbackSuggestions = (task: string, persona: string): string[] => {
  const personaTemplates: Record<string, string[]> = {
    collector: [
      '收集完成这个任务过程中的有趣瞬间',
      '建立一个专门的收藏夹记录相关资源',
      '寻找并整理与任务相关的美好事物',
      '创建一个进度收集册',
      '收集其他人对这个任务的有趣见解'
    ],
    competitor: [
      '设定一个挑战性的时间目标',
      '与朋友比赛看谁完成得更好',
      '为自己设立不同难度等级',
      '记录并突破个人最佳记录',
      '创建一个积分奖励系统'
    ],
    explorer: [
      '探索完成这个任务的不同方法',
      '发现任务背后的有趣故事',
      '寻找意想不到的连接和关联',
      '探索任务可能带来的新机会',
      '调查其他人是如何处理类似任务的'
    ],
    creator: [
      '为这个任务创造一个独特的仪式',
      '设计一个专属的工作环境',
      '创作与任务相关的艺术作品',
      '发明一个新的完成方法',
      '制作一个纪念品来庆祝完成'
    ],
    storyteller: [
      '为这个任务编写一个背景故事',
      '想象自己是故事中的英雄',
      '记录任务过程中的精彩情节',
      '与朋友分享任务的有趣经历',
      '创造一个关于任务意义的故事'
    ],
    comedian: [
      '寻找任务中的搞笑元素',
      '用幽默的方式重新定义任务',
      '创造一些有趣的任务昵称',
      '设计搞笑的庆祝方式',
      '与朋友分享任务中的趣事'
    ],
    leader: [
      '制定详细的任务执行计划',
      '组织团队一起完成任务',
      '设立里程碑和检查点',
      '创建任务完成的标准流程',
      '指导其他人完成类似任务'
    ],
    mover: [
      '在任务中加入身体活动元素',
      '创造任务的节奏和韵律',
      '设计动态的工作方式',
      '用运动来庆祝任务完成',
      '让任务过程充满活力和动感'
    ]
  };

  const baseTemplates = [
    '为这个任务设定一个有趣的背景故事',
    '添加一个小小的仪式感',
    '准备一个庆祝完成的方式',
    '邀请朋友一起参与',
    '记录过程中的有趣瞬间',
    '创造一个专属的工作环境',
    '设定一个有挑战性的目标',
    '寻找任务的深层意义'
  ];

  // 获取人格相关的建议
  const personaSuggestions = personaTemplates[persona] || baseTemplates;
  
  // 固定选择3个建议
  const shuffled = [...personaSuggestions].sort(() => 0.5 - Math.random());
  
  return shuffled.slice(0, 3); // 固定返回3个建议
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, persona } = body;

    // 验证输入
    if (!task || !persona) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 尝试使用智谱AI生成建议
    const suggestions = await generateAISuggestions(task, persona);

    return NextResponse.json({
      success: true,
      suggestions,
      metadata: {
        task: task.substring(0, 50) + (task.length > 50 ? '...' : ''),
        persona,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('AI suggestions API error:', error);
    
    // 非评判性错误处理 - 返回备用建议
    const fallbackSuggestions = generateFallbackSuggestions('', '');
    return NextResponse.json({
      success: false,
      suggestions: fallbackSuggestions,
      error: 'AI服务暂时不可用，这里是一些通用建议'
    }, { status: 200 }); // 返回200状态码，避免前端报错
  }
}

// 处理OPTIONS请求（CORS预检）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}