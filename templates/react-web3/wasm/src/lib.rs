//! WebAssembly 计算模块
//!
//! 使用 Rust + wasm-bindgen 编写的高性能计算模块
//! 编译命令: pnpm wasm:build

use wasm_bindgen::prelude::*;

// 初始化时设置 panic hook，便于调试
#[wasm_bindgen(start)]
pub fn init() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

// ==================== 斐波那契数列 ====================

/// 递归计算斐波那契数（用于演示计算密集型任务）
/// 注意：这是故意使用低效的递归算法来对比性能
#[wasm_bindgen]
pub fn fibonacci_recursive(n: u32) -> u64 {
    if n <= 1 {
        return n as u64;
    }
    fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)
}

/// 迭代计算斐波那契数（高效版本）
#[wasm_bindgen]
pub fn fibonacci_iterative(n: u32) -> u64 {
    if n <= 1 {
        return n as u64;
    }

    let mut a: u64 = 0;
    let mut b: u64 = 1;

    for _ in 2..=n {
        let temp = a + b;
        a = b;
        b = temp;
    }

    b
}

// ==================== 素数计算 ====================

/// 判断是否为素数
fn is_prime(n: u32) -> bool {
    if n < 2 {
        return false;
    }
    if n == 2 {
        return true;
    }
    if n % 2 == 0 {
        return false;
    }

    let sqrt = (n as f64).sqrt() as u32;
    for i in (3..=sqrt).step_by(2) {
        if n % i == 0 {
            return false;
        }
    }
    true
}

/// 计算范围内的素数个数
#[wasm_bindgen]
pub fn count_primes(max: u32) -> u32 {
    let mut count = 0;
    for i in 2..=max {
        if is_prime(i) {
            count += 1;
        }
    }
    count
}

/// 获取第 n 个素数
#[wasm_bindgen]
pub fn get_nth_prime(n: u32) -> u32 {
    if n == 0 {
        return 0;
    }

    let mut count = 0;
    let mut num = 2;

    while count < n {
        if is_prime(num) {
            count += 1;
        }
        if count < n {
            num += 1;
        }
    }

    num
}

// ==================== 图像处理 ====================

/// 灰度化图像 (RGBA -> 灰度)
/// 直接修改传入的数据
#[wasm_bindgen]
pub fn grayscale(data: &mut [u8]) {
    let pixel_count = data.len() / 4;
    
    for i in 0..pixel_count {
        let offset = i * 4;
        let r = data[offset] as u32;
        let g = data[offset + 1] as u32;
        let b = data[offset + 2] as u32;
        
        // 使用加权平均计算灰度值
        let gray = ((r * 299 + g * 587 + b * 114) / 1000) as u8;
        
        data[offset] = gray;
        data[offset + 1] = gray;
        data[offset + 2] = gray;
        // Alpha 通道保持不变
    }
}

/// 反色处理
#[wasm_bindgen]
pub fn invert(data: &mut [u8]) {
    let pixel_count = data.len() / 4;
    
    for i in 0..pixel_count {
        let offset = i * 4;
        data[offset] = 255 - data[offset];
        data[offset + 1] = 255 - data[offset + 1];
        data[offset + 2] = 255 - data[offset + 2];
        // Alpha 通道保持不变
    }
}

/// 调整亮度
/// factor: 亮度因子 (0.0 ~ 2.0, 1.0 为原始)
#[wasm_bindgen]
pub fn adjust_brightness(data: &mut [u8], factor: f32) {
    let pixel_count = data.len() / 4;
    
    for i in 0..pixel_count {
        let offset = i * 4;
        
        let r = (data[offset] as f32 * factor).clamp(0.0, 255.0) as u8;
        let g = (data[offset + 1] as f32 * factor).clamp(0.0, 255.0) as u8;
        let b = (data[offset + 2] as f32 * factor).clamp(0.0, 255.0) as u8;
        
        data[offset] = r;
        data[offset + 1] = g;
        data[offset + 2] = b;
        // Alpha 通道保持不变
    }
}

/// 高斯模糊（简化版 3x3）
#[wasm_bindgen]
pub fn blur(data: &mut [u8], width: u32, height: u32) {
    let w = width as usize;
    let h = height as usize;
    
    // 创建临时缓冲区
    let mut temp = data.to_vec();
    
    // 3x3 高斯核（简化版）
    let kernel: [[f32; 3]; 3] = [
        [1.0/16.0, 2.0/16.0, 1.0/16.0],
        [2.0/16.0, 4.0/16.0, 2.0/16.0],
        [1.0/16.0, 2.0/16.0, 1.0/16.0],
    ];
    
    for y in 1..(h - 1) {
        for x in 1..(w - 1) {
            let mut r: f32 = 0.0;
            let mut g: f32 = 0.0;
            let mut b: f32 = 0.0;
            
            for ky in 0..3 {
                for kx in 0..3 {
                    let px = x + kx - 1;
                    let py = y + ky - 1;
                    let idx = (py * w + px) * 4;
                    
                    r += data[idx] as f32 * kernel[ky][kx];
                    g += data[idx + 1] as f32 * kernel[ky][kx];
                    b += data[idx + 2] as f32 * kernel[ky][kx];
                }
            }
            
            let idx = (y * w + x) * 4;
            temp[idx] = r.clamp(0.0, 255.0) as u8;
            temp[idx + 1] = g.clamp(0.0, 255.0) as u8;
            temp[idx + 2] = b.clamp(0.0, 255.0) as u8;
        }
    }
    
    data.copy_from_slice(&temp);
}

// ==================== 数组计算 ====================

/// 计算数组和
#[wasm_bindgen]
pub fn sum_array(data: &[i32]) -> i64 {
    data.iter().map(|&x| x as i64).sum()
}

/// 快速排序（返回排序后的数组）
#[wasm_bindgen]
pub fn quick_sort(data: &mut [i32]) {
    data.sort_unstable();
}

// ==================== 字符串处理示例 ====================

/// 字符串反转（展示 wasm-bindgen 的字符串支持）
#[wasm_bindgen]
pub fn reverse_string(s: &str) -> String {
    s.chars().rev().collect()
}

/// 统计字符串中的单词数
#[wasm_bindgen]
pub fn word_count(s: &str) -> u32 {
    s.split_whitespace().count() as u32
}

// ==================== 数学计算 ====================

/// 计算阶乘
#[wasm_bindgen]
pub fn factorial(n: u32) -> u64 {
    if n <= 1 {
        return 1;
    }
    (2..=n as u64).product()
}

/// 最大公约数
#[wasm_bindgen]
pub fn gcd(mut a: u64, mut b: u64) -> u64 {
    while b != 0 {
        let temp = b;
        b = a % b;
        a = temp;
    }
    a
}

// ==================== 测试 ====================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fibonacci() {
        assert_eq!(fibonacci_iterative(10), 55);
        assert_eq!(fibonacci_recursive(10), 55);
    }

    #[test]
    fn test_primes() {
        assert_eq!(count_primes(10), 4); // 2, 3, 5, 7
        assert_eq!(get_nth_prime(4), 7);
    }

    #[test]
    fn test_factorial() {
        assert_eq!(factorial(5), 120);
        assert_eq!(factorial(0), 1);
    }
}
